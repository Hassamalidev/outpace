import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { buildTestApp, type TestApp } from '../test/helpers'
import { requireRole } from './auth'

const MEMBERSHIP = { userId: 'user_1', workspaceId: 'ws_1', role: 'MEMBER' as const }

describe('auth plugin', () => {
  let ctx: TestApp

  beforeEach(async () => {
    ctx = await buildTestApp()

    const whoAmI = async (request: {
      clerkId: string
      userId: string
      workspaceId: string
      workspaceRole: string | null
    }) => ({
      clerkId: request.clerkId,
      userId: request.userId,
      workspaceId: request.workspaceId,
      role: request.workspaceRole,
    })

    ctx.app.get('/protected', whoAmI)
    ctx.app.get('/session-only', { config: { auth: 'session' } }, whoAmI)
    ctx.app.get('/open', { config: { auth: 'public' } }, whoAmI)
    ctx.app.post('/webhooks/example', whoAmI)
    ctx.app.get('/admin-only', { preHandler: requireRole('OWNER', 'ADMIN') }, whoAmI)
  })

  afterEach(async () => {
    await ctx.app.close()
  })

  const authed = (token = 'valid-token', extra: Record<string, string> = {}) => ({
    authorization: `Bearer ${token}`,
    ...extra,
  })

  it('rejects a protected route without a token', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/protected' })

    expect(response.statusCode).toBe(401)
    expect(response.json().error.code).toBe('UNAUTHORIZED')
  })

  it('rejects a malformed authorization header', async () => {
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/protected',
      headers: { authorization: 'Basic abc' },
    })

    expect(response.statusCode).toBe(401)
  })

  it('rejects an invalid token', async () => {
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/protected',
      headers: authed('forged-token'),
    })

    expect(response.statusCode).toBe(401)
    expect(response.json().error.code).toBe('INVALID_TOKEN')
  })

  it('attaches userId and workspaceId for a member', async () => {
    ctx.prisma.workspaceMember.findFirst.mockResolvedValue(MEMBERSHIP)

    const response = await ctx.app.inject({ method: 'GET', url: '/protected', headers: authed() })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      clerkId: 'clerk_user_1',
      userId: 'user_1',
      workspaceId: 'ws_1',
      role: 'MEMBER',
    })
  })

  it('looks up the workspace named in the session claim', async () => {
    ctx.prisma.workspaceMember.findFirst.mockResolvedValue({
      ...MEMBERSHIP,
      workspaceId: 'ws_claimed',
    })

    const response = await ctx.app.inject({
      method: 'GET',
      url: '/protected',
      headers: authed('workspace-token'),
    })

    expect(response.json().workspaceId).toBe('ws_claimed')
    expect(ctx.prisma.workspaceMember.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { user: { clerkId: 'clerk_user_1' }, workspaceId: 'ws_claimed' },
      }),
    )
  })

  it('falls back to the default workspace when the session claim is stale', async () => {
    ctx.prisma.workspaceMember.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(MEMBERSHIP)

    const response = await ctx.app.inject({
      method: 'GET',
      url: '/protected',
      headers: authed('workspace-token'),
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().workspaceId).toBe('ws_1')
  })

  it('returns 403 when the x-workspace-id header names a workspace the user is not in', async () => {
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/protected',
      headers: authed('valid-token', { 'x-workspace-id': 'ws_other' }),
    })

    expect(response.statusCode).toBe(403)
    expect(response.json().error.code).toBe('FORBIDDEN')
  })

  it('returns 401 when the user has no workspace at all', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/protected', headers: authed() })

    expect(response.statusCode).toBe(401)
    expect(response.json().error.code).toBe('WORKSPACE_REQUIRED')
  })

  it('uses the cached membership without querying the database', async () => {
    ctx.redis.get.mockResolvedValue(JSON.stringify(MEMBERSHIP))

    const response = await ctx.app.inject({ method: 'GET', url: '/protected', headers: authed() })

    expect(response.statusCode).toBe(200)
    expect(ctx.prisma.workspaceMember.findFirst).not.toHaveBeenCalled()
  })

  it('only verifies the session on session-mode routes', async () => {
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/session-only',
      headers: authed(),
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      clerkId: 'clerk_user_1',
      userId: '',
      workspaceId: '',
      role: null,
    })
    expect(ctx.prisma.workspaceMember.findFirst).not.toHaveBeenCalled()
  })

  it('still requires a token on session-mode routes', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/session-only' })

    expect(response.statusCode).toBe(401)
  })

  it('skips authentication for public routes and webhooks', async () => {
    const open = await ctx.app.inject({ method: 'GET', url: '/open' })
    const webhook = await ctx.app.inject({ method: 'POST', url: '/webhooks/example' })

    expect(open.statusCode).toBe(200)
    expect(webhook.statusCode).toBe(200)
  })

  it('does not treat lookalike paths as public', async () => {
    ctx.app.get('/healthcheck-secrets', async () => ({ secret: true }))

    const response = await ctx.app.inject({ method: 'GET', url: '/healthcheck-secrets' })

    expect(response.statusCode).toBe(401)
  })

  it('enforces roles with requireRole', async () => {
    ctx.prisma.workspaceMember.findFirst.mockResolvedValue(MEMBERSHIP)
    const asMember = await ctx.app.inject({ method: 'GET', url: '/admin-only', headers: authed() })

    ctx.prisma.workspaceMember.findFirst.mockResolvedValue({ ...MEMBERSHIP, role: 'ADMIN' })
    const asAdmin = await ctx.app.inject({ method: 'GET', url: '/admin-only', headers: authed() })

    expect(asMember.statusCode).toBe(403)
    expect(asAdmin.statusCode).toBe(200)
  })
})
