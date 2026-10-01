import { Body, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { ReactNode } from 'react'

export interface EmailLayoutProps {
  /** Inbox preview text shown next to the subject line. */
  preview: string
  /** Brand name shown in the footer; white-label workspaces override it. */
  brandName?: string
  children: ReactNode
}

/** Base layout shared by every transactional email the platform sends. */
export function EmailLayout({ preview, brandName = 'Forge AI', children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section>{children}</Section>
          <Text style={footer}>Sent by {brandName}</Text>
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: '#f6f7f9',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: '24px 0',
}

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  marginTop: '32px',
}
