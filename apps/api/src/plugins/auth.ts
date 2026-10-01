import { verifyToken as clerkVerifyToken } from '@clerk/backend'
import type { WorkspaceRole } from '@forge/db'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

import { cached } from '../lib/cache'
import { AppError, forbidden, unauthorized } from '../lib/errors'

/** The subset of Clerk session claims the API relies on. */
export interface AuthClaims {
  /** Clerk user id. */
  sub: string
  /** Clerk `publicMetadata`, exposed through the session token template. */
  metadata?: { workspaceId?: string } | undefined
}

export type TokenVerifier = (token: string) => Promise<AuthClaims>

/** How a route is authenticated. Routes default to `'workspace'`. */
export type RouteAuthMode =
  /** No authentication. */
  | 'public'
  /** A valid Clerk session, but the user may not exist in our database yet. */
  | 'session'
  /** A valid Clerk session for a user who is a member of the active workspace. */
  | 'workspace'

declare module 'fastify' {
  interface FastifyRequest {
    /** Clerk user id of the caller. Empty string on public routes. */
    clerkId: string
    /** Database id of the caller. Empty string on public and session-only routes. */
    userId: string
    /** Active workspace. Empty string on public and session-only routes. */
    workspaceId: string
    workspaceRole: WorkspaceRole | null
  }

  interface FastifyContextConfig {
    auth?: RouteAuthMode
  }
}

export interface AuthPluginOptions {
  verifyToken: TokenVerifier
}

interface Membership {
  userId: string
  workspaceId: string
  role: WorkspaceRole
}

/** URL prefixes that never carry a user session (signed or anonymous by design). */
const PUBLIC_PREFIXES = ['/health', '/webhooks/', '/t/']
const MEMBERSHIP_CACHE_SECONDS = 60

export function createClerkVerifier(secretKey: string | undefined): TokenVerifier {
  return async (token) => {
    if (!secretKey) {
      throw new AppError(500, 'AUTH_NOT_CONFIGURED', 'CLERK_SECRET_KEY is not configured')
    }
    const payload = await clerkVerifyToken(token, { secretKey })
    const metadata = (payload as { metadata?: { workspaceId?: unknown } }).metadata
    return {
      sub: payload.sub,
      metadata:
        typeof metadata?.workspaceId === 'string'
          ? { workspaceId: metadata.workspaceId }
          : undefined,
    }
  }
}

function extractBearerToken(request: FastifyRequest): string | null {
  const header = request.headers.authorization
  if (!header) return null
  const [scheme, token] = header.split(' ')
  return scheme?.toLowerCase() === 'bearer' && token ? token : null
}

function resolveAuthMode(request: FastifyRequest): RouteAuthMode {
  const configured = request.routeOptions.config.auth
  if (configured) return configured
  if (request.method === 'OPTIONS' || request.is404) return 'public'
  const path = request.url.split('?')[0] ?? request.url
  const isPublic = PUBLIC_PREFIXES.some((prefix) =>
    prefix.endsWith('/') ? path.startsWith(prefix) : path === prefix,
  )
  return isPublic ? 'public' : 'workspace'
}

async function authPlugin(app: FastifyInstance, options: AuthPluginOptions) {
  app.decorateRequest('clerkId', '')
  app.decorateRequest('userId', '')
  app.decorateRequest('workspaceId', '')
  app.decorateRequest('workspaceRole', null)

  function findMembership(clerkId: string, workspaceId: string | undefined) {
    return cached<Membership | null>(
      app.redis,
      `auth:membership:${clerkId}:${workspaceId ?? 'default'}`,
      MEMBERSHIP_CACHE_SECONDS,
      () =>
        app.prisma.workspaceMember.findFirst({
          where: { user: { clerkId }, ...(workspaceId ? { workspaceId } : {}) },
          orderBy: { invitedAt: 'asc' },
          select: { userId: true, workspaceId: true, role: true },
        }),
    )
  }

  app.addHook('onRequest', async (request) => {
    const mode = resolveAuthMode(request)
    if (mode === 'public') return

    const token = extractBearerToken(request)
    if (!token) throw unauthorized()

    let claims: AuthClaims
    try {
      claims = await options.verifyToken(token)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw unauthorized('Invalid or expired session token', 'INVALID_TOKEN')
    }

    request.clerkId = claims.sub
    if (mode === 'session') return

    // An explicit header (workspace switcher) must match a real membership.
    // The JWT claim is only a default and may be stale, so it falls back gracefully.
    const headerValue = request.headers['x-workspace-id']
    const requested = typeof headerValue === 'string' && headerValue ? headerValue : undefined

    let membership = await findMembership(claims.sub, requested ?? claims.metadata?.workspaceId)
    if (!membership && requested) throw forbidden('You are not a member of this workspace')
    if (!membership && claims.metadata?.workspaceId) {
      membership = await findMembership(claims.sub, undefined)
    }
    if (!membership) {
      throw unauthorized('No workspace found for this user', 'WORKSPACE_REQUIRED')
    }

    request.userId = membership.userId
    request.workspaceId = membership.workspaceId
    request.workspaceRole = membership.role
  })
}

/**
 * preHandler guard for role-restricted routes:
 * `{ preHandler: requireRole('OWNER', 'ADMIN') }`.
 */
export function requireRole(...roles: WorkspaceRole[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.workspaceRole || !roles.includes(request.workspaceRole)) {
      throw forbidden('Your role does not allow this action')
    }
  }
}

export default fp(authPlugin, { name: 'auth' })
