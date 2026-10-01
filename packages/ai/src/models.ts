/**
 * Model identifiers used across the platform. Claude is the primary provider,
 * OpenAI is the automatic fallback (see architectural decision 3 in CLAUDE.md).
 */
export const AI_MODELS = {
  /** Primary model for analysis, personalization and reply handling. */
  claudePrimary: 'claude-sonnet-5-5',
  /** Cheaper, faster model for classification and extraction. */
  claudeFast: 'claude-haiku-4-5-20251001',
  /** Fallback when the Claude API is unavailable. */
  openaiFallback: 'gpt-4o',
  /** Embeddings for pgvector similarity search. */
  openaiEmbedding: 'text-embedding-3-small',
} as const

export type AIModelKey = keyof typeof AI_MODELS
