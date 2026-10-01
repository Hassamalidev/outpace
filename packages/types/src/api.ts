/** Structured JSON error body returned by every API error response. */
export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    statusCode: number
    requestId?: string
    details?: unknown
  }
}

/** Standard envelope for paginated list endpoints. */
export interface Paginated<T> {
  data: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type DependencyStatus = 'ok' | 'error'

/** Response of `GET /health`. */
export interface HealthResponse {
  status: 'ok' | 'degraded'
  version: string
  uptime: number
  db: DependencyStatus
  redis: DependencyStatus
}
