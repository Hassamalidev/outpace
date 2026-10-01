# CLAUDE.md — Forge AI: The World's Most Complete B2B Sales Platform

> **Read every word before writing a single line of code.**
> This is a world-class product specification. Work phase by phase, task by task.
> Every task ends with a git commit and push. Never batch tasks into one commit.
> When a phase is complete, open a PR, pass CI, merge to main.

---

## 1. Product Vision

**Forge AI** is the most complete AI-powered B2B outbound sales platform on earth. It replaces your entire outbound sales team — finding ideal customers, researching them deeply, reaching out across every channel, handling every reply, booking every meeting, and learning continuously to get better results over time.

### Who we beat and how

| Competitor | What they do | How Forge AI wins |
|---|---|---|
| **Explee / AutoGTM** | AI email agent, URL→leads | We do everything they do + 6 more channels + deeper AI + real contact DB |
| **Apollo.io** | Contact DB + sequences | 40% cheaper, AI personalization Apollo cannot match, no per-seat pricing |
| **Instantly.ai** | Email warmup + unibox | Our warmup is superior + we add AI, LinkedIn, intent data |
| **Smartlead.ai** | Multi-inbox cold email | We add AI SDR, waterfall enrichment, ABM, revenue intelligence |
| **Lemlist** | Email + LinkedIn + video | We do all of this natively + we add AI voiceovers + buying signals |
| **Clay** | Waterfall enrichment | We have the same enrichment but natively in a full outreach platform |
| **Artisan / 11x** | Autonomous AI SDR | We are cheaper, more transparent, give users more control |
| **Reply.io** | Multi-channel sequences | Our AI is deeper, our analytics are richer, we have real-time intent data |
| **Outreach / Salesloft** | Enterprise engagement | We are 10× cheaper with 90% of the features + faster to deploy |
| **ZoomInfo** | Intent data + DB | We aggregate intent from 12 sources, not just Bombora |

### Core USPs nobody else has

1. **Buying Signal Aggregator** — Real-time intent data from 12 sources (LinkedIn activity, job postings, funding news, website visits, G2 reviews, technographic changes, social mentions). Outreach fires automatically when a signal is detected.
2. **Waterfall Enrichment Engine** — 14 data sources tried in order per contact. Industry-best deliverability because every email is verified before send.
3. **AI Video Personalization** — Auto-generated personalized video thumbnails and Loom-style screen recordings with AI voice addressing each prospect by name.
4. **Multi-threaded ABM** — Target entire accounts (companies), map every stakeholder, orchestrate coordinated multi-channel outreach across all of them simultaneously.
5. **Conversation Intelligence** — Record and transcribe sales calls, extract objections, auto-update CRM, generate follow-up emails from the call transcript.
6. **AI Campaign Coach** — After every 100 sends, an AI coach analyses what is working, rewrites underperforming copy, tests new angles, and explains the reasoning in plain English.
7. **Autonomous AI SDR mode** — One toggle: the AI runs the entire pipeline without human input. Finds leads, personalises, sends, replies, books meetings, updates CRM. Human only reviews booked meetings.
8. **LinkedIn Ghostwriter** — AI writes LinkedIn posts for the user to warm up target accounts organically before cold outreach begins. Increases reply rates by 30–60%.
9. **Global Compliance Engine** — GDPR (EU), CAN-SPAM (US), CASL (Canada), CCPA (California), PDPA (Thailand/Singapore), LGPD (Brazil) — all handled automatically based on the recipient's geography.
10. **Revenue Attribution** — Track which campaigns actually close deals (not just book meetings) via CRM sync. Show true ROI per campaign, per channel, per segment.

---

## 2. Tech Stack

### Frontend — `apps/web`
- **Framework:** Next.js 14 (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **State management:** Zustand (client state) + TanStack Query v5 (server state)
- **Charts:** Recharts + custom SVG for funnels
- **Forms:** React Hook Form + Zod
- **Auth:** Clerk
- **Real-time:** Server-Sent Events for live updates
- **Email preview:** `react-email` renderer in-browser
- **Rich text:** TipTap (email template editor)
- **Tables:** TanStack Table v8
- **Drag and drop:** @dnd-kit (sequence builder)
- **Internationalisation:** next-intl (English, Spanish, French, German, Portuguese, Japanese launch languages)
- **Analytics:** PostHog (product analytics, feature flags, session recordings)

### Backend — `apps/api`
- **Runtime:** Node.js 20 LTS + TypeScript strict
- **Framework:** Fastify 4 (typed routes, schema-first)
- **ORM:** Prisma 5
- **Primary DB:** PostgreSQL 15 (Supabase managed)
- **Cache + Queue store:** Redis 7 (Upstash serverless)
- **Search:** Typesense (fast contact search, self-hosted on Railway)
- **Queue:** BullMQ (all background jobs)
- **Object storage:** Cloudflare R2 (uploads, exports, video thumbnails)
- **Email:** Nodemailer + custom SMTP pool
- **AI:** Anthropic Claude (primary), OpenAI GPT-4o (fallback + embeddings)
- **Voice AI:** ElevenLabs (video voiceovers)
- **Video:** Puppeteer (screenshot personalised video thumbnails)
- **Phone/SMS:** Twilio
- **PDF generation:** Puppeteer headless (client reports)
- **Payments:** Stripe
- **Transactional email:** Resend
- **Monitoring:** Sentry + Axiom

### Workers — `apps/workers`
Separate deployable process. All BullMQ consumers live here. Never in the API process.

### Chrome Extension — `apps/extension`
- **Build:** WXT (modern extension framework, Manifest V3)
- **Framework:** React + Tailwind
- **Runs on:** LinkedIn, Apollo, company websites

### Infrastructure
- **Monorepo:** Turborepo + pnpm workspaces
- **CI/CD:** GitHub Actions
- **Frontend deploy:** Vercel (with ISR)
- **API + Workers deploy:** Railway (auto-scale)
- **Database:** Supabase (PostgreSQL + pgvector for embeddings)
- **Redis:** Upstash (serverless Redis)
- **CDN:** Cloudflare
- **Domains:** Namecheap API (auto-provision sending domains)
- **DNS management:** Cloudflare API (SPF, DKIM, DMARC, MX)
- **Email verification:** ZeroBounce + MillionVerifier (dual)
- **Secrets:** Doppler (all environments)

---

## 3. Repository Structure

```
forge-ai/
├── apps/
│   ├── web/                      # Next.js 14 frontend
│   ├── api/                      # Fastify backend
│   ├── workers/                  # BullMQ consumers (separate process)
│   └── extension/                # Chrome extension
├── packages/
│   ├── db/                       # Prisma schema + client singleton
│   ├── types/                    # Shared TypeScript types
│   ├── email-templates/          # react-email components
│   ├── ai/                       # Shared AI prompt library
│   └── config/                   # ESLint, Prettier, TSConfig bases
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/                         # Architecture decision records
├── turbo.json
├── pnpm-workspace.yaml
└── CLAUDE.md
```

---

## 4. Complete Database Schema

File: `packages/db/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

// ─── Auth & Users ────────────────────────────────────────────────────────────

model User {
  id                String              @id @default(cuid())
  clerkId           String              @unique
  email             String              @unique
  name              String?
  avatarUrl         String?
  timezone          String              @default("UTC")
  locale            String              @default("en")
  credits           Float               @default(30)
  plan              Plan                @default(FREE)
  role              UserRole            @default(MEMBER)
  onboardingStep    Int                 @default(0)
  onboardingDone    Boolean             @default(false)
  calcomToken       String?
  calcomRefresh     String?
  calcomUserId      String?
  linkedinCookie    String?             // for LinkedIn automation
  linkedinUrn       String?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  workspaceMembers  WorkspaceMember[]
  apiKeys           ApiKey[]
  notifications     Notification[]
  creditTx          CreditTransaction[]
}

enum Plan { FREE STARTER GROWTH SCALE ENTERPRISE }
enum UserRole { MEMBER ADMIN OWNER }

model Workspace {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  logoUrl         String?
  primaryColor    String    @default("#2563EB")
  customDomain    String?   @unique
  customDomainVerified Boolean @default(false)
  plan            Plan      @default(FREE)
  credits         Float     @default(30)
  dailyEmailLimit Int       @default(500)
  createdAt       DateTime  @default(now())

  members         WorkspaceMember[]
  campaigns       Campaign[]
  leads           Lead[]
  sequences       Sequence[]
  templates       EmailTemplate[]
  sendingDomains  SendingDomain[]
  integrations    Integration[]
  webhooks        Webhook[]
  apiKeys         ApiKey[]
  suppressionList SuppressionEntry[]
  accounts        TargetAccount[]
  creditTx        CreditTransaction[]
}

model WorkspaceMember {
  id          String          @id @default(cuid())
  workspaceId String
  workspace   Workspace       @relation(fields: [workspaceId], references: [id])
  userId      String
  user        User            @relation(fields: [userId], references: [id])
  role        WorkspaceRole   @default(MEMBER)
  invitedAt   DateTime        @default(now())
  acceptedAt  DateTime?

  @@unique([workspaceId, userId])
}

enum WorkspaceRole { OWNER ADMIN MEMBER VIEWER }

// ─── Campaigns ───────────────────────────────────────────────────────────────

model Campaign {
  id              String          @id @default(cuid())
  workspaceId     String
  workspace       Workspace       @relation(fields: [workspaceId], references: [id])
  name            String
  websiteUrl      String?
  status          CampaignStatus  @default(ANALYZING)
  mode            CampaignMode    @default(MANUAL)   // MANUAL or AUTONOMOUS
  websiteAnalysis Json?
  icp             Json?           // ICP segments with fit scores
  emailStyle      Json?
  abmMode         Boolean         @default(false)
  targetAccountIds String[]
  channels        Channel[]       @default([EMAIL])
  dailySendCap    Int             @default(100)
  createdBy       String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  leads           Lead[]
  sequences       CampaignSequence[]
  emailVariants   EmailVariant[]
  stats           CampaignStat[]
  events          EmailEvent[]
  buyingSignals   BuyingSignal[]
}

enum CampaignStatus { ANALYZING PENDING_APPROVAL RUNNING PAUSED COMPLETED ARCHIVED }
enum CampaignMode   { MANUAL AUTONOMOUS }
enum Channel        { EMAIL LINKEDIN TWITTER SMS WHATSAPP PHONE }

// ─── Sequences ───────────────────────────────────────────────────────────────

model Sequence {
  id          String         @id @default(cuid())
  workspaceId String
  workspace   Workspace      @relation(fields: [workspaceId], references: [id])
  name        String
  description String?
  steps       SequenceStep[]
  campaigns   CampaignSequence[]
  isTemplate  Boolean        @default(false)
  createdAt   DateTime       @default(now())
}

model CampaignSequence {
  campaignId  String
  campaign    Campaign  @relation(fields: [campaignId], references: [id])
  sequenceId  String
  sequence    Sequence  @relation(fields: [sequenceId], references: [id])

  @@id([campaignId, sequenceId])
}

model SequenceStep {
  id              String      @id @default(cuid())
  sequenceId      String
  sequence        Sequence    @relation(fields: [sequenceId], references: [id])
  order           Int
  channel         Channel
  delayDays       Int         @default(0)
  delayHours      Int         @default(0)
  sendWindow      Json?       // { days: [1,2,3,4,5], hourStart: 9, hourEnd: 17, tz: "prospect" }
  condition       Json?       // { if: "opened", then: "skip" | "continue" | "branch_to": stepId }
  subjectTemplate String?
  bodyTemplate    String?     // Liquid template syntax
  linkedinAction  LinkedInAction?
  smsBody         String?
  isActive        Boolean     @default(true)
}

enum LinkedInAction { CONNECT VIEW_PROFILE FOLLOW MESSAGE COMMENT_POST LIKE_POST }

// ─── Leads ───────────────────────────────────────────────────────────────────

model Lead {
  id                String      @id @default(cuid())
  workspaceId       String
  workspace         Workspace   @relation(fields: [workspaceId], references: [id])
  campaignId        String?
  campaign          Campaign?   @relation(fields: [campaignId], references: [id])
  targetAccountId   String?
  targetAccount     TargetAccount? @relation(fields: [targetAccountId], references: [id])

  // Identity
  firstName         String
  lastName          String
  email             String
  emailVerified     Boolean     @default(false)
  emailScore        Int?        // 0-100 from verifier
  phone             String?
  linkedinUrl       String?
  twitterHandle     String?

  // Company
  company           String?
  companyDomain     String?
  companyLinkedin   String?
  title             String?
  seniority         String?
  department        String?
  companySize       String?
  industry          String?
  location          String?
  country           String?
  timezone          String?

  // Scoring
  fitScore          Int?        // 0-100 AI-generated
  intentScore       Int?        // 0-100 from buying signals
  segment           String?

  // Enrichment
  enrichmentSources Json?       // which sources returned data
  enrichmentData    Json?       // full raw enrichment payload
  techStack         String[]    // from BuiltWith/Wappalyzer
  fundingStage      String?
  fundingAmount     BigInt?
  employeeGrowth    Float?      // % change in headcount last 6mo
  recentNews        Json[]      // [{ headline, url, date }]
  jobPostings       Json[]      // [{ title, url, postedDate }]

  // Personalization
  personalizedEmail Json?       // { subject, body, preheader }
  icebreaker        String?     // one custom sentence generated from research
  videoThumbnailUrl String?

  // Status
  status            LeadStatus  @default(PENDING)
  emailStatus       EmailStatus @default(NOT_SENT)
  linkedinStatus    LinkedInStatus @default(NOT_STARTED)
  sequenceStep      Int         @default(0)
  unsubscribed      Boolean     @default(false)
  doNotContact      Boolean     @default(false)
  complianceRegion  String?     // "EU", "CA", "US", etc.
  consentGiven      Boolean     @default(false)

  // Metadata
  source            String?     // "apollo", "csv_import", "manual", "chrome_ext"
  importBatchId     String?
  crmContactId      String?     // HubSpot/Salesforce contact ID
  crmDealId         String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  emailEvents       EmailEvent[]
  inboxMessages     InboxMessage[]
  sequenceEnrollments SequenceEnrollment[]
  buyingSignals     BuyingSignal[]
  callRecordings    CallRecording[]
}

enum LeadStatus      { PENDING APPROVED ACTIVE REPLIED HOT WARM COLD MEETING_BOOKED CONVERTED PAUSED BOUNCED }
enum EmailStatus     { NOT_SENT QUEUED SENT OPENED CLICKED REPLIED BOUNCED UNSUBSCRIBED }
enum LinkedInStatus  { NOT_STARTED CONNECTION_SENT CONNECTED MESSAGE_SENT REPLIED }

model SequenceEnrollment {
  id            String    @id @default(cuid())
  leadId        String
  lead          Lead      @relation(fields: [leadId], references: [id])
  sequenceId    String
  currentStep   Int       @default(0)
  status        String    @default("active") // active, paused, completed, exited
  enrolledAt    DateTime  @default(now())
  nextStepAt    DateTime?
  exitReason    String?
}

// ─── Account-Based Marketing ─────────────────────────────────────────────────

model TargetAccount {
  id              String    @id @default(cuid())
  workspaceId     String
  workspace       Workspace @relation(fields: [workspaceId], references: [id])
  name            String
  domain          String
  website         String?
  industry        String?
  size            String?
  location        String?
  linkedinUrl     String?
  fitScore        Int?
  intentScore     Int?
  stage           AccountStage @default(TARGET)
  assignedTo      String?
  crmAccountId    String?
  tierLevel       Int?      // 1 = highest priority
  researchData    Json?
  stakeholderMap  Json?     // { "executive": [...], "champion": [...], "blocker": [...] }
  createdAt       DateTime  @default(now())

  leads           Lead[]
  buyingSignals   BuyingSignal[]
}

enum AccountStage { TARGET ENGAGED MEETING OPPORTUNITY CLOSED_WON CLOSED_LOST }

// ─── Email Infrastructure ────────────────────────────────────────────────────

model SendingDomain {
  id                String    @id @default(cuid())
  workspaceId       String?
  workspace         Workspace? @relation(fields: [workspaceId], references: [id])
  domain            String    @unique
  registrarOrderId  String?
  cloudflareZoneId  String?
  warmthScore       Int       @default(0)
  dailyLimit        Int       @default(50)
  sentToday         Int       @default(0)
  spfVerified       Boolean   @default(false)
  dkimVerified      Boolean   @default(false)
  dmarcVerified     Boolean   @default(false)
  mxVerified        Boolean   @default(false)
  isActive          Boolean   @default(true)
  isPlatformPool    Boolean   @default(true)
  provisionedAt     DateTime  @default(now())
  fullyWarmedAt     DateTime?

  mailboxes         Mailbox[]
}

model Mailbox {
  id                    String        @id @default(cuid())
  domainId              String
  domain                SendingDomain @relation(fields: [domainId], references: [id])
  address               String        @unique
  displayName           String?
  smtpHost              String
  smtpPort              Int
  imapHost              String
  imapPort              Int
  usernameEncrypted     String
  passwordEncrypted     String
  warmthScore           Int           @default(0)
  dailyLimit            Int           @default(30)
  sentToday             Int           @default(0)
  isWarmed              Boolean       @default(false)
  isActive              Boolean       @default(true)
  lastSentAt            DateTime?
  reputationScore       Float?        // from Google Postmaster / MxToolbox
}

// ─── Inbox & Replies ──────────────────────────────────────────────────────────

model InboxMessage {
  id              String        @id @default(cuid())
  workspaceId     String
  leadId          String?
  lead            Lead?         @relation(fields: [leadId], references: [id])
  threadId        String
  channel         Channel       @default(EMAIL)
  direction       String        // "inbound" | "outbound"
  from            String
  to              String
  subject         String?
  bodyText        String
  bodyHtml        String?
  classification  MessageClass  @default(NEUTRAL)
  sentimentScore  Float?        // -1 to 1
  aiDraft         String?
  aiDraftConfidence Float?
  reviewRequired  Boolean       @default(false)
  repliedAt       DateTime?
  openedAt        DateTime?
  receivedAt      DateTime      @default(now())
}

enum MessageClass { HOT WARM NEUTRAL COLD UNSUBSCRIBE OUT_OF_OFFICE REFERRAL }

// ─── Email Templates ─────────────────────────────────────────────────────────

model EmailTemplate {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  name        String
  subject     String
  bodyHtml    String
  bodyText    String
  channel     Channel   @default(EMAIL)
  tags        String[]
  isShared    Boolean   @default(false)
  performance Json?     // { openRate, replyRate, sampleSize }
  createdBy   String
  createdAt   DateTime  @default(now())
}

model EmailVariant {
  id          String    @id @default(cuid())
  campaignId  String
  campaign    Campaign  @relation(fields: [campaignId], references: [id])
  label       String    // "A", "B", "C"
  subject     String
  bodyHtml    String
  sentCount   Int       @default(0)
  openCount   Int       @default(0)
  clickCount  Int       @default(0)
  replyCount  Int       @default(0)
  isWinner    Boolean   @default(false)
  isPaused    Boolean   @default(false)
  confidence  Float?    // statistical confidence 0-1
}

// ─── Events & Analytics ──────────────────────────────────────────────────────

model EmailEvent {
  id          String    @id @default(cuid())
  leadId      String
  lead        Lead      @relation(fields: [leadId], references: [id])
  campaignId  String
  campaign    Campaign  @relation(fields: [campaignId], references: [id])
  event       EventType
  channel     Channel   @default(EMAIL)
  metadata    Json?
  ip          String?
  userAgent   String?
  timestamp   DateTime  @default(now())

  @@index([campaignId, timestamp])
  @@index([leadId])
}

enum EventType { SENT DELIVERED OPENED CLICKED REPLIED BOUNCED UNSUBSCRIBED SPAM_REPORT MEETING_BOOKED }

model CampaignStat {
  id            String    @id @default(cuid())
  campaignId    String
  campaign      Campaign  @relation(fields: [campaignId], references: [id])
  date          DateTime  @db.Date
  channel       Channel   @default(EMAIL)
  sent          Int       @default(0)
  delivered     Int       @default(0)
  opened        Int       @default(0)
  clicked       Int       @default(0)
  replied       Int       @default(0)
  hotReplies    Int       @default(0)
  meetings      Int       @default(0)
  bounced       Int       @default(0)
  unsubscribed  Int       @default(0)
  spend         Float     @default(0)
  costPerLead   Float?
  revenue       Float?    // from CRM deal close value

  @@unique([campaignId, date, channel])
}

// ─── Buying Signals ───────────────────────────────────────────────────────────

model BuyingSignal {
  id              String        @id @default(cuid())
  workspaceId     String
  leadId          String?
  lead            Lead?         @relation(fields: [leadId], references: [id])
  campaignId      String?
  campaign        Campaign?     @relation(fields: [campaignId], references: [id])
  targetAccountId String?
  targetAccount   TargetAccount? @relation(fields: [targetAccountId], references: [id])
  type            SignalType
  source          String        // "linkedin", "news", "g2", "intent", "funding", etc.
  title           String
  description     String?
  url             String?
  strength        Int           // 1-10
  triggeredAction String?       // what outreach action was auto-triggered
  createdAt       DateTime      @default(now())
}

enum SignalType {
  JOB_CHANGE FUNDING_ROUND HIRING_SPREE TECH_CHANGE
  COMPETITOR_MENTIONED WEBSITE_VISIT G2_REVIEW NEWS_MENTION
  LINKEDIN_POST FOLLOW_UP_DUE INTENT_SURGE PRODUCT_LAUNCH
}

// ─── Call Intelligence ────────────────────────────────────────────────────────

model CallRecording {
  id              String    @id @default(cuid())
  leadId          String
  lead            Lead      @relation(fields: [leadId], references: [id])
  workspaceId     String
  twilioCallSid   String?   @unique
  duration        Int?      // seconds
  recordingUrl    String?
  transcriptRaw   String?
  transcriptJson  Json?     // speaker-diarised segments
  summary         String?   // AI-generated
  nextSteps       String[]  // AI-extracted action items
  objections      String[]  // AI-extracted objections raised
  sentiment       Float?
  crmUpdated      Boolean   @default(false)
  followUpEmail   String?   // AI-drafted follow-up
  createdAt       DateTime  @default(now())
}

// ─── Integrations ────────────────────────────────────────────────────────────

model Integration {
  id                String          @id @default(cuid())
  workspaceId       String
  workspace         Workspace       @relation(fields: [workspaceId], references: [id])
  type              IntegrationType
  accessToken       String?
  refreshToken      String?
  tokenExpiry       DateTime?
  metadata          Json?           // portal ID, instance URL, etc.
  isActive          Boolean         @default(true)
  lastSyncAt        DateTime?
  createdAt         DateTime        @default(now())

  @@unique([workspaceId, type])
}

enum IntegrationType {
  HUBSPOT SALESFORCE PIPEDRIVE CLOSE MONDAY NOTION
  SLACK TEAMS DISCORD
  CALENDLY CALCOM GOOGLE_CALENDAR OUTLOOK_CALENDAR
  ZAPIER MAKE N8N
  LINKEDIN TWITTER PHANTOMBUSTER
  TWILIO SENDGRID
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

model Webhook {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  url         String
  events      String[]
  secret      String
  isActive    Boolean   @default(true)
  failCount   Int       @default(0)
  lastTriggeredAt DateTime?
  deliveries  WebhookDelivery[]
}

model WebhookDelivery {
  id          String    @id @default(cuid())
  webhookId   String
  webhook     Webhook   @relation(fields: [webhookId], references: [id])
  event       String
  payload     Json
  statusCode  Int?
  response    String?
  attempts    Int       @default(1)
  success     Boolean   @default(false)
  createdAt   DateTime  @default(now())
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

model ApiKey {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  name        String
  keyHash     String    @unique
  keyPrefix   String    // first 8 chars, shown in UI
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  scopes      String[]  // ["campaigns:read", "leads:write", etc.]
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
}

// ─── Billing ─────────────────────────────────────────────────────────────────

model CreditTransaction {
  id              String    @id @default(cuid())
  workspaceId     String
  workspace       Workspace @relation(fields: [workspaceId], references: [id])
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  amount          Float     // negative = debit
  balanceAfter    Float
  type            String    // "top_up", "email_sent", "linkedin_action", "sms_sent", "free_trial", "refund"
  description     String
  stripePaymentId String?
  leadId          String?
  campaignId      String?
  createdAt       DateTime  @default(now())

  @@index([workspaceId, createdAt])
}

// ─── Compliance ───────────────────────────────────────────────────────────────

model SuppressionEntry {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  email       String
  reason      String    // "unsubscribed", "bounced", "spam", "manual", "dnc_list"
  global      Boolean   @default(false) // global suppression across all workspaces
  addedAt     DateTime  @default(now())

  @@unique([workspaceId, email])
}

model ComplianceLog {
  id          String    @id @default(cuid())
  workspaceId String
  leadId      String?
  email       String
  action      String    // "consent_obtained", "unsubscribe_processed", "data_deleted", "opt_in_confirmed"
  region      String
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime  @default(now())
}

// ─── Notifications ───────────────────────────────────────────────────────────

model Notification {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  type        String
  title       String
  body        String
  url         String?
  read        Boolean   @default(false)
  createdAt   DateTime  @default(now())
}
```

---

## 5. Queue Definitions

File: `apps/workers/src/queues/index.ts`

Define all BullMQ queues with their job types and default settings:

```typescript
export const QUEUES = {
  WEBSITE_ANALYZER:  'website-analyzer',   // analyze URL, generate ICP
  LEAD_FINDER:       'lead-finder',         // find leads for ICP segment
  DEEP_RESEARCH:     'deep-research',       // 5-layer research per lead
  EMAIL_WRITER:      'email-writer',        // write personalized email per lead
  EMAIL_SENDER:      'email-sender',        // send one email
  DOMAIN_WARMER:     'domain-warmer',       // warming cron
  REPLY_HANDLER:     'reply-handler',       // process inbound reply
  SEQUENCE_RUNNER:   'sequence-runner',     // advance leads through sequence steps
  SIGNAL_DETECTOR:   'signal-detector',     // scan buying signals
  ABM_ORCHESTRATOR:  'abm-orchestrator',   // multi-threaded account outreach
  LINKEDIN_ACTION:   'linkedin-action',     // LinkedIn automation
  SMS_SENDER:        'sms-sender',
  CALL_TRANSCRIBER:  'call-transcriber',    // transcribe Twilio recording
  AB_TEST_ANALYZER:  'ab-test-analyzer',
  CAMPAIGN_OPTIMIZER:'campaign-optimizer',  // nightly optimizer
  CRM_SYNC:          'crm-sync',
  REPORT_GENERATOR:  'report-generator',
  COMPLIANCE_SWEEP:  'compliance-sweep',    // daily GDPR/CAN-SPAM checks
} as const
```

---

## Phase 1 — Monorepo Foundation & Auth

**Branch:** `phase/1-foundation`
**Commit prefix:** `feat(p1):`

### Task 1.1 — Initialize monorepo
- `npx create-turbo@latest forge-ai --package-manager pnpm`
- Remove default apps. Create `apps/web` (Next.js 14, TypeScript, Tailwind, App Router, strict mode), `apps/api` (Fastify, TypeScript), `apps/workers` (plain Node.js, TypeScript), `apps/extension` (WXT scaffold)
- Create packages: `packages/db`, `packages/types`, `packages/email-templates`, `packages/ai`, `packages/config`
- `turbo.json`: pipelines for `build`, `dev`, `lint`, `typecheck`, `test`
- Shared `tsconfig.base.json` with `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- Shared ESLint config extending `eslint-config-turbo` + `@typescript-eslint/recommended`
- Shared Prettier config
- `.env.example` listing every variable from section 8 of this document
- **Commit:** `feat(p1): initialize turborepo monorepo`

### Task 1.2 — Prisma schema + seed
- Add Prisma to `packages/db`. Copy the full schema from section 4.
- `packages/db/src/index.ts`: singleton Prisma client with connection pooling config
- `packages/db/prisma/seed.ts`: seeds one workspace, one admin user, one demo campaign with 10 leads in various statuses, one sending domain with 3 mailboxes, sample CampaignStats for the last 30 days
- Add `pnpm db:push`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm db:studio` scripts
- **Commit:** `feat(p1): prisma schema with all models and seed data`

### Task 1.3 — Fastify API skeleton
- `apps/api/src/server.ts`: Fastify with `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`, `@fastify/multipart`, `@fastify/sensible`
- `apps/api/src/plugins/auth.ts`: verify Clerk JWT on every request, attach `req.workspaceId` and `req.userId`. Throw 401 if missing. Skip for public routes and webhooks.
- `apps/api/src/plugins/error-handler.ts`: global error handler, logs to Axiom, returns structured JSON errors
- `GET /health`: returns `{ status: "ok", version, uptime, db: "ok", redis: "ok" }`
- `apps/api/src/lib/redis.ts`: ioredis singleton with retry logic
- `apps/api/src/lib/prisma.ts`: re-export from `packages/db`
- **Commit:** `feat(p1): fastify api skeleton with auth plugin`

### Task 1.4 — Workers process
- `apps/workers/src/index.ts`: starts all BullMQ consumers, one per queue
- Each worker file is `apps/workers/src/workers/{name}.worker.ts`
- Add BullBoard at `apps/api` route `/admin/queues` (protected by admin role). Shows all queues, job counts, failed jobs, retry button.
- `apps/workers/src/lib/redis.ts`: shared Redis connection for BullMQ
- **Commit:** `feat(p1): workers process with bullmq consumers and bullboard`

### Task 1.5 — Clerk auth + user sync
- Install `@clerk/nextjs` in `apps/web`. Add `ClerkProvider` to root layout.
- `(auth)/sign-in` and `(auth)/sign-up` pages using Clerk hosted components
- `middleware.ts`: protect all `(dashboard)` routes, redirect unauthenticated to sign-in
- `POST /api/auth/sync`: called from `apps/web` after Clerk sign-up webhook. Upserts `User` + creates default `Workspace`. Returns workspace ID.
- Store active `workspaceId` in Clerk user `publicMetadata` so it is available in the JWT
- **Commit:** `feat(p1): clerk auth with user and workspace sync`

### Task 1.6 — Dashboard shell UI
- `(dashboard)/layout.tsx`: sidebar with icon + label navigation. Items: Dashboard, Campaigns, Leads, Inbox, Accounts (ABM), Sequences, Templates, Analytics, Buying Signals, Settings, Billing
- Top bar: workspace switcher, credit balance pill (live via TanStack Query), notifications bell with badge, user avatar + dropdown (profile, settings, sign out)
- Mobile: sidebar collapses to bottom tab bar (5 key items), hamburger reveals full menu
- Implement workspace switcher: clicking opens a popover listing all workspaces the user is a member of + "Create workspace" button
- Dark theme by default: background `#0A0E1A`, surface `#111827`, border `#1F2937`, text `#F9FAFB`, accent `#3B82F6`
- Support light theme via `data-theme="light"` on `<html>`; persist in localStorage
- Add keyboard shortcuts: `g c` → Campaigns, `g l` → Leads, `g i` → Inbox, `g a` → Analytics (implement with a custom hook)
- Install shadcn: Button, Card, Badge, Table, Input, Select, Dialog, Sheet, Tabs, Skeleton, Toast, Tooltip, Popover, Command, Avatar, DropdownMenu, Separator, Progress, Switch, Textarea, ScrollArea, Accordion
- **Commit:** `feat(p1): dashboard shell with sidebar, top bar, theme, keyboard shortcuts`

### Task 1.7 — Internationalisation setup
- Install `next-intl`. Add message files: `messages/en.json`, `es.json`, `fr.json`, `de.json`, `pt.json`, `ja.json`
- All user-facing strings go through `useTranslations()`. No hardcoded English strings in JSX.
- Locale detection: read from user's Clerk profile locale, fallback to `Accept-Language` header, fallback to `en`
- Add language switcher to user settings
- `en.json` must be complete before any other locale (others can have placeholders that fall back to English)
- **Commit:** `feat(p1): next-intl internationalisation with 6 locales`

---

## Phase 2 — AI Analysis & ICP Generation

**Branch:** `phase/2-ai-pipeline`
**Commit prefix:** `feat(p2):`

### Task 2.1 — Website analyzer service
- `packages/ai/src/prompts/website-analyzer.ts`: define the system + user prompt. Use Claude's tool use to force structured JSON output.
- `apps/api/src/services/ai/website-analyzer.ts`:
  - Accepts a URL
  - Scrapes with `axios` + `cheerio`: homepage, `/about`, `/pricing`, `/product`, `/solutions`, `/customers` (tries each, skips 404s)
  - Extracts meta title, meta description, h1, h2 headings, body text (first 3000 chars per page)
  - Detects tech stack from HTML (script tags, meta generator, known class names)
  - Calls Claude claude-3-5-sonnet-20241022 with structured tool output:
    ```typescript
    interface WebsiteAnalysis {
      companyName: string
      tagline: string
      productDescription: string      // 3-sentence max
      valueProposition: string        // what problem does it solve
      targetMarket: string            // who they think their customer is
      pricingModel: 'freemium'|'subscription'|'usage'|'enterprise'|'one-time'|'unknown'
      averageContractValue: 'smb'|'mid-market'|'enterprise'|'mixed'|'unknown'
      geographies: string[]           // US, EU, global, etc.
      industry: string
      techStack: string[]
      competitors: string[]           // names mentioned on site or inferred
      uniqueSellingPoints: string[]   // 3-5 bullet points
      primaryCTA: string              // what the site asks visitors to do
    }
    ```
  - Retry up to 3 times on Claude API error with exponential backoff
  - Cache result in Redis for 24h (key: `website-analysis:${md5(url)}`)
- Unit tests with Anthropic client mocked
- **Commit:** `feat(p2): website analyzer with claude structured output and redis cache`

### Task 2.2 — Competitor research step
- `apps/api/src/services/ai/competitor-researcher.ts`
- Takes the `competitors[]` from Task 2.1
- For each competitor: scrapes their site (same as 2.1 but lighter, homepage only)
- Calls Claude to identify: which customer segments they serve, what they charge, what their weaknesses are (from G2/Capterra review snippets, fetched via Bing Search API)
- Returns `CompetitorMap[]`: `{ name, segments, pricing, weaknesses, differentiator }` — "where can we win against them?"
- This context is stored in the campaign and used later in email personalization (e.g. "I saw you're using [Competitor] — we do X differently")
- **Commit:** `feat(p2): competitor research step with weakness mapping`

### Task 2.3 — ICP generator service
- `apps/api/src/services/ai/icp-generator.ts`
- Takes `WebsiteAnalysis` + `CompetitorMap[]`
- Calls Claude to generate 6–10 ICP segments. Each segment:
  ```typescript
  interface ICPSegment {
    name: string                    // "Wedding floral studios"
    fitScore: number                // 0-100
    reasoning: string               // 2-3 sentences
    companySize: string             // "1-10 employees"
    seniorityLevels: string[]       // ["owner", "coo", "vp operations"]
    searchKeywords: string[]        // for Apollo/Hunter search
    titleKeywords: string[]
    industries: string[]            // SIC/NAICS category hints
    geographies: string[]           // target geos for this segment
    estimatedMarketSize: number     // rough count of companies
    averageDealSize: 'smb'|'mid'|'enterprise'
    outreachAngle: string           // the specific pain point to lead with
    exampleCompanies: string[]      // 3 real examples Claude knows
    competitorOverlap: string[]     // which competitors also target this segment
    whiteSpace: boolean             // true = competitors ignore this segment
  }
  ```
- Sort by: `whiteSpace DESC`, then `fitScore DESC`
- **Commit:** `feat(p2): icp generator with 10 segments, whitespace analysis, outreach angles`

### Task 2.4 — Campaign creation API
- `POST /campaigns`: accepts `{ websiteUrl, name?, channels?, dailySendCap?, mode? }`
  - Creates `Campaign` (status = ANALYZING)
  - Dispatches `WEBSITE_ANALYZER` BullMQ job
  - Returns `{ campaignId }` immediately (async)
- `GET /campaigns/:id/status`: returns `{ status, analysis, icp, progress }` for polling
- `PATCH /campaigns/:id/approve`: accepts `{ selectedSegments, emailStyle, channels, dailySendCap, sequenceId? }`
  - Validates segments exist in campaign ICP
  - Sets status = RUNNING
  - Dispatches `LEAD_FINDER` jobs (one per segment)
- `GET /campaigns`: paginated list with stats summary per campaign
- `DELETE /campaigns/:id`: soft delete (sets status = ARCHIVED)
- **Commit:** `feat(p2): campaign crud api with async analyze workflow`

### Task 2.5 — Campaign creation wizard (5 steps)
- Route: `(dashboard)/campaigns/new/page.tsx`
- **Step 1 — URL Input:** Full-screen centered card. Large URL input. "Analyse my business" button. Show recently analysed URLs from other workspace members.
- **Step 2 — Analysis Loading:** Animated step progress. Messages cycle: "Reading your website...", "Mapping your market...", "Researching competitors...", "Generating your ideal customer profiles...". Real ETA countdown. Show competitor logos found.
- **Step 3 — ICP Review:** Grid of segment cards. Each card shows: segment name, fit score (animated gauge), market size, outreach angle, competitor overlap badge (amber if overlap, green if whitespace), example companies. User can toggle each on/off, edit the outreach angle inline, drag to reorder.
- **Step 4 — Sequence & Style:** Choose a sequence (multi-step drip) or single email. Email tone: Professional / Conversational / Bold / Curious. Length: Short (3 lines) / Medium (6 lines) / Long (10 lines). CTA: Book a call / Reply to learn more / Visit link / Request demo. Preview a generated sample email (live AI generation as options change, debounced 800ms).
- **Step 5 — Channels & Launch:** Toggle which channels to use (Email on, LinkedIn off by default). Set daily send cap slider. Show projected results: "At 100 emails/day you can expect 2–5 replies and 1–2 meetings per week based on similar campaigns." Credit cost estimate. "Launch Campaign" button triggers confetti + redirects to campaign dashboard.
- **Commit:** `feat(p2): 5-step campaign creation wizard with live preview`

---

## Phase 3 — Waterfall Contact Enrichment

**Branch:** `phase/3-enrichment`
**Commit prefix:** `feat(p3):`

### Task 3.1 — Apollo.io integration
- `apps/api/src/services/contacts/apollo.ts`
- Implements: `searchPeople({ titleKeywords, searchKeywords, companySize, industries, geographies, page, perPage })` → `ApolloContact[]`
- Implements: `bulkEnrich(emails: string[])` → enriched contact data
- Handles 429 rate limits with a Redis-backed token bucket (Apollo free: 300 req/hour, paid: higher)
- Maps Apollo response to our internal `LeadCreateInput` type
- **Commit:** `feat(p3): apollo.io search and bulk enrich`

### Task 3.2 — Hunter.io + LinkedIn + Clearbit enrichment
- `apps/api/src/services/contacts/hunter.ts`: `findEmail(firstName, lastName, domain)` → `{ email, score }`
- `apps/api/src/services/contacts/clearbit.ts`: `enrich(email)` → company size, funding, tech stack, LinkedIn URL
- `apps/api/src/services/contacts/linkedin-scraper.ts`: uses RapidAPI LinkedIn scraper to fetch profile data (title, company, location, recent activity)
- `apps/api/src/services/contacts/builtwith.ts`: `getTechStack(domain)` → `string[]`
- `apps/api/src/services/contacts/crunchbase.ts`: `getCompanyFunding(domain)` → `{ stage, amount, lastRoundDate }`
- **Commit:** `feat(p3): hunter, clearbit, linkedin, builtwith, crunchbase enrichment services`

### Task 3.3 — Waterfall enrichment engine (Clay-equivalent)
- `apps/api/src/services/contacts/waterfall.ts`
- For a given contact (name + company domain), tries these sources **in order** until a verified email is found:
  1. Apollo bulk enrich
  2. Hunter domain search
  3. Clearbit Prospector API
  4. MillionVerifier (if we already have a guessed email)
  5. LinkedIn scraper (find email in contact info)
  6. Snov.io API
  7. Skrapp.io API
  8. RocketReach API
  9. Lusha API
  10. ContactOut API
  11. Enrow API
  12. Findymail API
- Each source call is rate-limited. Results cached in Redis 72h.
- Stops as soon as a source returns an email with verification score ≥ 75
- Logs which source found the email (for enrichment quality analytics)
- Total cost per enriched contact capped at $0.003 across all source API costs
- **Commit:** `feat(p3): 12-source waterfall enrichment engine`

### Task 3.4 — Email verification
- `apps/api/src/services/contacts/verifier.ts`
- Primary: ZeroBounce bulk API (up to 2000 emails per batch)
- Fallback: MillionVerifier
- Returns: `{ email, valid: boolean, score: number, reason: string }`
- Disposable/role-based emails (`info@`, `noreply@`, guerrilla mail domains) → auto-reject
- Cache results in Redis 30 days
- Invalid emails: mark lead `BOUNCED` immediately, no email sent, no credit charge
- Batch verification: process leads in groups of 200, emit progress events via SSE
- **Commit:** `feat(p3): dual-provider email verification with batch processing`

### Task 3.5 — Deep research service (5 layers)
- `apps/api/src/services/ai/deep-researcher.ts`
- For each lead, runs these 5 research layers in parallel (Promise.allSettled):
  1. **Company website:** scrape homepage + blog for recent posts, product announcements
  2. **LinkedIn profile:** fetch via RapidAPI — headline, summary, recent activity, shared connections
  3. **Company news:** Bing Search API `"{company}" site:techcrunch.com OR site:businesswire.com OR site:prnewswire.com` — last 90 days
  4. **Job postings:** search `"{company}" jobs site:linkedin.com/jobs OR site:lever.co OR site:greenhouse.io` — indicates growth areas
  5. **Tech stack + funding:** BuiltWith + Crunchbase (from Task 3.2 services)
- Compiles into `LeadContext`: all research findings, structured for Claude
- Caches per `(email, domain)` pair for 48h in Redis
- Max 10 concurrent deep research jobs. Queue-backed.
- **Commit:** `feat(p3): parallel 5-layer deep research with redis cache`

### Task 3.6 — Lead finder worker
- `apps/workers/src/workers/lead-finder.worker.ts`
- Job input: `{ campaignId, segment: ICPSegment, workspaceId }`
- Runs Apollo search for the segment (pages through until enough leads found)
- For each raw contact: runs waterfall enrichment → email verification → create `Lead` in DB
- Dispatches `DEEP_RESEARCH` job for each verified lead
- Emits SSE progress event every 10 leads: `{ found, verified, total }`
- Updates campaign `status` once all segments done
- **Commit:** `feat(p3): lead finder worker with waterfall enrichment pipeline`

### Task 3.7 — Leads UI
- `(dashboard)/leads/page.tsx`: power-user data table
  - Columns: checkbox, name, title, company, email (partially masked), fit score bar, intent score, segment, status badge, last activity, actions
  - Sortable columns (client-side for current page, server-side for cross-page sort)
  - Filters: campaign, segment, status, country, company size, industry, fit score range, date added
  - Saved filter presets
  - Bulk actions: approve, pause, export CSV, move to another campaign, delete
  - Search bar: fuzzy search on name, email, company (Typesense-backed)
- Lead detail side panel (opens on row click):
  - Contact info with copy buttons, LinkedIn icon link, Twitter link
  - Company info: logo (Clearbit logo API), size, industry, funding, tech stack chips
  - Fit score + intent score with explanations
  - Research timeline: buying signals, news, job postings
  - Enrichment sources breakdown
  - Email preview: personalized email with subject + body
  - Activity timeline: all EmailEvents
  - Quick actions: approve, pause, mark DNC, open in CRM
- **Commit:** `feat(p3): leads table with filters, search, side panel, bulk actions`

---

## Phase 4 — Sequences & Multi-Channel Orchestration

**Branch:** `phase/4-sequences`
**Commit prefix:** `feat(p4):`

### Task 4.1 — Sequence builder API
- `POST /sequences`: create a new sequence with steps array
- `PUT /sequences/:id`: update entire sequence (replaces steps)
- `GET /sequences`: list workspace sequences
- Each `SequenceStep` validates: delay, channel, body template (must be valid Liquid syntax)
- Add Liquid template validation: `{{ lead.firstName }}`, `{{ lead.company }}`, `{{ lead.icebreaker }}`, `{{ lead.companyNews }}`, `{{ lead.techStack }}`, `{{ workspace.senderName }}`, `{{ meeting.link }}`
- **Commit:** `feat(p4): sequence crud api with liquid template validation`

### Task 4.2 — Visual sequence builder UI
- `(dashboard)/sequences/[id]/page.tsx`
- Drag-and-drop step builder (dnd-kit)
- Each step is a card: channel icon, delay badge ("Day 3"), action summary, edit + delete buttons
- "Add Step" button opens a step editor dialog:
  - Channel selector (Email, LinkedIn, SMS)
  - Delay: days + hours
  - Send window: day-of-week checkboxes (Mon–Fri default), time window (9am–5pm), prospect's timezone or fixed timezone
  - Condition: "Only run if previous step was NOT opened / WAS replied to"
  - Body editor: TipTap rich text with Liquid variable chips in a palette. For LinkedIn: plain text only. For SMS: 160-char counter.
- Subject line field for email steps with A/B variant toggle (add up to 3 subject variants per step)
- Step preview: renders Liquid template with dummy lead data in real-time
- Save + "Attach to Campaign" button
- Library of pre-built sequence templates: 7-step cold email, 3-step LinkedIn + email, 5-step account-based
- **Commit:** `feat(p4): drag-and-drop sequence builder with liquid preview`

### Task 4.3 — Sequence runner worker
- `apps/workers/src/workers/sequence-runner.worker.ts`
- BullMQ cron: runs every 5 minutes
- Fetches all `SequenceEnrollment` records where `status = active` AND `nextStepAt <= now()`
- For each enrollment:
  1. Check if lead is suppressed / unsubscribed / DNC → exit enrollment if so
  2. Check step condition (e.g. skip step if lead already opened previous email)
  3. Dispatch the appropriate channel job (`EMAIL_SENDER`, `LINKEDIN_ACTION`, `SMS_SENDER`)
  4. Calculate `nextStepAt` from next step's delay
  5. If no more steps: mark enrollment `completed`
- Handles timezone-aware send windows: converts step's send window to lead's local timezone, reschedules to next valid window if current time is outside
- **Commit:** `feat(p4): sequence runner with timezone-aware send windows and conditions`

### Task 4.4 — Email template variables & personalization render
- `apps/api/src/services/email/template-renderer.ts`
- Takes a Liquid template string + `LeadContext` object
- Renders: `{{ lead.firstName }}`, `{{ lead.company }}`, `{{ lead.title }}`, `{{ lead.icebreaker }}`, `{{ lead.companyNews | first }}`, `{{ lead.techStack | join: ", " }}`, `{{ lead.fundingStage }}`, `{{ meeting.link }}`, `{{ sender.name }}`, `{{ sender.title }}`
- Special variable `{{ lead.icebreaker }}`: calls AI to generate a single unique sentence based on deep research (e.g. "I saw you just hired a Head of Growth — congrats on the expansion")
- HTML email: wraps rendered body in a minimal responsive email layout (no heavy styling — plain text style performs best)
- Plain text variant: auto-generated from HTML (strip tags, fix whitespace)
- **Commit:** `feat(p4): liquid template renderer with all personalization variables`

---

## Phase 5 — Email Sending Infrastructure

**Branch:** `phase/5-email-infra`
**Commit prefix:** `feat(p5):`

### Task 5.1 — Domain provisioning service
- `apps/api/src/services/email/domain-provisioner.ts`
- Uses Namecheap API to register domains automatically
- Naming strategy for sending domains: if customer's domain is `acme.com`, register `getacme.io`, `acme-hq.com`, `teamacme.io` (auto-pick available one)
- After registration, uses Cloudflare API to:
  - Add domain to Cloudflare (create zone)
  - Set name servers at Namecheap to Cloudflare's
  - Create A record (→ `127.0.0.1` placeholder)
  - Create MX record (→ mail server for inbound)
  - Create SPF TXT: `v=spf1 include:sendgrid.net include:_spf.google.com ~all`
  - Generate 2048-bit RSA keypair, create DKIM TXT record
  - Create DMARC TXT: `v=DMARC1; p=quarantine; rua=mailto:dmarc@forge.ai; pct=100`
- Poll DNS propagation (every 5 min, timeout 2h). Mark domain active once all records verified.
- Platform pool: auto-provision 20 domains at boot, auto-provision more when utilisation > 80%
- **Commit:** `feat(p5): automated domain provisioning with cloudflare dns setup`

### Task 5.2 — Mailbox warming system
- `apps/api/src/services/email/warmer.ts`
- Creates 3 named mailboxes per domain: `alex@`, `sarah@`, `james@` (first names for authenticity)
- Warming schedule (ramp-up over 6 weeks):
  - Week 1: 5 emails/day (reply rate 90%)
  - Week 2: 10 emails/day
  - Week 3: 20 emails/day
  - Week 4: 30 emails/day (full speed)
  - Week 5–6: maintain + monitor
- Warming emails: sent within a network of 200+ seed mailboxes we own across different providers (Gmail, Outlook, Yahoo). They auto-open, auto-reply, and auto-move from Spam if needed (simulates real human behaviour).
- Track `warmthScore` per mailbox: based on delivery rate, spam rate, reply rate
- `warmthScore >= 80` → mailbox considered "warm", eligible for customer outreach
- `apps/workers/src/workers/domain-warmer.worker.ts`: BullMQ cron every 30 min, processes warming sends in batches
- Google Postmaster Tools integration: monitor domain reputation weekly (via `postmaster.googleapis.com` API)
- **Commit:** `feat(p5): mailbox warming with seed network, reputation monitoring`

### Task 5.3 — SMTP pool manager
- `apps/api/src/services/email/smtp-pool.ts`
- `getMailbox(workspaceId, campaignId)` → picks the optimal warm mailbox using weighted round-robin:
  - Weight = `warmthScore` (higher warmth = more sends assigned)
  - Hard cap: never exceed `dailyLimit` per mailbox
  - Prefer mailboxes in the same timezone region as recipient (reduces spam score)
- `releaseMailbox(mailboxId)` → mark last-used timestamp
- Daily limits reset via BullMQ cron at midnight UTC
- SMTP credentials decrypted at use time via AES-256-GCM (key from `ENCRYPTION_KEY` env)
- Connection pooling: maintain up to 5 persistent SMTP connections per mailbox
- **Commit:** `feat(p5): smtp pool manager with weighted round-robin`

### Task 5.4 — Email sender worker
- `apps/workers/src/workers/email-sender.worker.ts`
- Job input: `{ leadId, templateId?, subjectOverride?, bodyOverride?, campaignId, sequenceStepId? }`
- Steps:
  1. Fetch lead + personalized email from DB
  2. Render Liquid template (Task 4.4)
  3. Get mailbox from SMTP pool (Task 5.3)
  4. Embed tracking pixel: `<img src="${TRACKING_URL}/p/${emailEventId}" width="1" height="1" />`
  5. Wrap all links with click tracker: `${TRACKING_URL}/c/${emailEventId}?url=${encodeURIComponent(originalUrl)}`
  6. Set `Reply-To`: `${leadId}@inbound.forge.ai` (routes replies to our inbound handler)
  7. Set `List-Unsubscribe`: `<mailto:unsub@forge.ai?subject=unsub-${leadId}>`, `<${UNSUB_URL}/${leadId}>`
  8. Send via Nodemailer
  9. On success: create `EmailEvent` (SENT), deduct credits ($0.015/email), update `Lead.emailStatus`
  10. On permanent bounce (5xx): create EmailEvent (BOUNCED), add to suppression list, refund credit
  11. On soft failure: retry queue with exponential backoff (3 retries, 5/30/120 min)
- Rate limit: 90-second gap between consecutive sends from the same mailbox
- **Commit:** `feat(p5): email sender worker with tracking, reply-to routing, credit deduction`

### Task 5.5 — Tracking endpoint + inbound handler
- `GET /t/p/:eventId`: tracking pixel endpoint — 1×1 transparent GIF, creates `EmailEvent(OPENED)`
- `GET /t/c/:eventId`: click tracker — creates `EmailEvent(CLICKED)`, redirects to original URL
- `GET /t/u/:leadId`: unsubscribe page — shows branded "You've been removed" page, updates `Lead.unsubscribed = true`, adds to `SuppressionEntry`, logs to `ComplianceLog`
- `POST /webhooks/inbound-email`: receives parsed inbound email from Cloudflare Email Routing
  - Parse `Reply-To` header to extract `leadId`
  - Create `InboxMessage` (direction = "inbound")
  - Classify with Claude: `HOT | WARM | NEUTRAL | COLD | UNSUBSCRIBE | OUT_OF_OFFICE | REFERRAL`
  - If `UNSUBSCRIBE` or `OUT_OF_OFFICE`: handle immediately, do not auto-reply
  - If `REFERRAL`: extract the referred contact's name/email from the message body (Claude extracts it), create a new `Lead`
  - Dispatch `REPLY_HANDLER` job
  - Send real-time SSE notification to inbox UI
- **Commit:** `feat(p5): tracking pixel, click tracker, unsubscribe page, inbound email handler`

---

## Phase 6 — LinkedIn & Multi-Channel

**Branch:** `phase/6-multichannel`
**Commit prefix:** `feat(p6):`

### Task 6.1 — LinkedIn automation service
- `apps/api/src/services/channels/linkedin.ts`
- Users connect LinkedIn by providing their session cookie (from browser developer tools) — stored encrypted
- Actions supported:
  - `viewProfile(linkedinUrn)`: view a profile (warms up before connecting)
  - `sendConnectionRequest(linkedinUrn, message?)`: send with optional 300-char note
  - `sendMessage(threadId, message)`: send a DM to a connection
  - `likePost(postUrn)`: like a recent post
  - `commentPost(postUrn, comment)`: comment on a post (AI-generated relevant comment)
  - `followCompanyPage(companyUrn)`: follow their company page
- Uses `linkedin-api` library or direct API calls with the user's cookies
- Rate limiting per LinkedIn account: max 25 connection requests/day, max 50 messages/day (to stay under LinkedIn limits)
- **Commit:** `feat(p6): linkedin automation service with rate limiting`

### Task 6.2 — LinkedIn action worker
- `apps/workers/src/workers/linkedin-action.worker.ts`
- Processes `LINKEDIN_ACTION` queue jobs dispatched by the sequence runner
- Handles each `LinkedInAction` enum value
- For `COMMENT_POST`: before commenting, calls Claude to generate a relevant, non-spammy 1-sentence comment about the post content (scraped from the post URL)
- For `sendConnectionRequest`: uses the sequence step's body template as the connection note
- Logs each action as an `EmailEvent` with `channel = LINKEDIN`
- On LinkedIn rate limit hit: reschedule job for next day
- **Commit:** `feat(p6): linkedin action worker with ai comment generation`

### Task 6.3 — SMS sending (Twilio)
- `apps/api/src/services/channels/sms.ts`
- Wraps Twilio Messages API
- Only sends if lead has a verified mobile number (from enrichment)
- Respect opt-out (STOP replies auto-handled by Twilio and synced to suppression list)
- Character count management: split into multiple segments if > 160 chars
- `apps/workers/src/workers/sms-sender.worker.ts`: processes SMS queue jobs
- Credits: $0.05 per SMS sent
- **Commit:** `feat(p6): sms channel with twilio, opt-out handling`

### Task 6.4 — LinkedIn Ghostwriter feature
- `apps/api/src/services/ai/linkedin-ghostwriter.ts`
- For each active campaign, generates 2 LinkedIn posts per week for the user to publish manually (or auto-schedule via LinkedIn API if connected)
- Posts are designed to warm up target accounts before direct outreach: thought leadership relevant to the ICP's pain points, containing subtle hooks that attract ideal customers
- Post formats: story post, tip list, contrarian take, case study, question post
- Posts are shown in a "Content Calendar" section in the app
- User can edit, approve, copy, or schedule posts
- Tracking: when a post gets likes/comments from target accounts in their lead list, it's flagged as a buying signal
- **Commit:** `feat(p6): linkedin ghostwriter with content calendar`

### Task 6.5 — Channel performance dashboard
- `(dashboard)/campaigns/[id]/channels/page.tsx`
- Side-by-side comparison: Email vs LinkedIn vs SMS
- Metrics per channel: sent, open rate (email only), reply rate, meeting conversion rate, cost per meeting
- Funnel chart per channel
- Time to first reply per channel (median)
- Best performing send times per channel (heat map by hour and day of week)
- **Commit:** `feat(p6): multi-channel performance dashboard`

---

## Phase 7 — AI Personalization Engine

**Branch:** `phase/7-personalization`
**Commit prefix:** `feat(p7):`

### Task 7.1 — Email writer service
- `apps/api/src/services/ai/email-writer.ts`
- Input: `LeadContext` (all deep research data) + `ICPSegment` (outreach angle) + `EmailStyle` + `WebsiteAnalysis`
- Calls Claude with a carefully engineered prompt that produces:
  ```typescript
  interface PersonalizedEmail {
    subject: string             // 6-9 words, no clickbait
    preheader: string           // 1 sentence, complements subject
    bodyText: string            // plain text, Liquid syntax for any variables
    bodyHtml: string            // same, with minimal inline styles
    icebreaker: string          // the single custom sentence referencing their specific research
    ctaLine: string             // the call-to-action line
    followUpVariants: string[]  // 2 follow-up email subjects for A/B testing
    aiReasoning: string         // why this angle was chosen (shown in UI for user education)
  }
  ```
- System prompt enforces: no generic openings ("I hope this finds you well"), no lies, no fake urgency, no aggressive CTAs, must pass as genuinely human-written
- Tone options: professional (default), conversational, direct, curious, bold
- Include competitor context if lead's tech stack contains a known competitor product
- Store in `Lead.personalizedEmail`
- **Commit:** `feat(p7): ai email writer with icebreaker and reasoning transparency`

### Task 7.2 — AI video thumbnail personalization
- `apps/api/src/services/personalization/video-thumbnails.ts`
- Generates a personalized image for each lead that looks like a paused Loom video
- Uses Puppeteer headless to render an HTML template to a screenshot:
  - Shows the sender's (workspace) logo
  - A "play button" overlay
  - Lead's company logo (fetched from Clearbit Logo API)
  - Text overlay: "Hi [FirstName]!" in large font
  - Background: a blurred screenshot of the lead's company website
- Uploads PNG to Cloudflare R2. Returns URL.
- Embeds as a clickable image in the email (links to a personalized landing page or Calendly)
- `Lead.videoThumbnailUrl` populated
- Queue-backed: `apps/workers/src/workers/video-thumbnail.worker.ts`
- **Commit:** `feat(p7): ai video thumbnail personalization with puppeteer`

### Task 7.3 — Email writer worker + batch processing
- `apps/workers/src/workers/email-writer.worker.ts`
- Processes `EMAIL_WRITER` queue jobs (dispatched after deep research completes)
- For each lead: calls `email-writer.ts` → stores result → dispatches `EMAIL_SENDER` job (if campaign auto-approve is on) or sets status to `PENDING_APPROVAL` (if manual mode)
- Concurrency: 5 workers in parallel
- Rate limiting: max 100 Claude calls/minute (to stay within API limits)
- Preview mode: when campaign is in `PENDING_APPROVAL`, generates emails for the first 10 leads and stops. User reviews and approves all before the rest are generated and sent.
- **Commit:** `feat(p7): email writer worker with batch processing and preview mode`

### Task 7.4 — Email preview & approval UI
- `(dashboard)/campaigns/[id]/preview/page.tsx`
- Shows the first 10 generated emails as a card carousel
- Each card: lead info top-left, email preview (subject + body), AI reasoning panel (collapsible), confidence score badge
- Actions per email: "Approve", "Edit", "Regenerate", "Skip this lead"
- Bulk: "Approve all and launch" button
- Editing: click any part of the email to edit inline. AI suggestions appear as you type (ghost text).
- Filter by segment to review one group at a time
- **Commit:** `feat(p7): email preview and approval ui with inline editing`

---

## Phase 8 — AI Inbox & Reply Handler

**Branch:** `phase/8-inbox`
**Commit prefix:** `feat(p8):`

### Task 8.1 — AI reply handler service
- `apps/api/src/services/ai/reply-handler.ts`
- Input: full thread history + `LeadContext` + `WebsiteAnalysis` + workspace `Company` info
- System prompt defines persona: knowledgeable, helpful, never pushy, never lies
- Built-in objection playbook (Claude uses these as few-shot examples):
  - "Not interested" → acknowledge, briefly explain value, offer to reconnect in 3 months
  - "Send me more info" → 3-bullet summary, ask for 15-min call not a long meeting
  - "Already have a solution" → ask what they wish it did differently (discovery question)
  - "Too expensive" → pivot to ROI, ask what budget looks like, offer a trial
  - "Who is this?" → warm intro + value prop + social proof (one customer win)
  - "Not the right time" → ask when would be, offer a future touchpoint, not now
  - "Can you do [date/time]?" → book via Cal.com API immediately
  - "Can you send a proposal?" → send a PDF summary from the report generator
  - Competitor mentioned → pull from competitor research, address weakness diplomatically
- Output: `{ draft, confidence, suggestedAction, reasoning }`
  - `suggestedAction`: `"auto_send" | "human_review" | "book_meeting" | "close_lost" | "follow_up_later"`
- If confidence < 0.75 or `suggestedAction = "human_review"`: flag for human review in inbox
- **Commit:** `feat(p8): ai reply handler with full objection playbook`

### Task 8.2 — Reply handler worker
- `apps/workers/src/workers/reply-handler.worker.ts`
- For each inbound message classification:
  - `HOT`: run AI handler → if auto_send and confidence ≥ 0.75 → send reply. If book_meeting → call Cal.com, send invite.
  - `WARM`: run AI handler → always human_review for WARM
  - `COLD`: mark lead cold, pause sequence enrollment
  - `OUT_OF_OFFICE`: parse return date from OOO message (Claude extracts it), reschedule next step for that date + 1 day
  - `REFERRAL`: extract referred contact, create new lead, notify user via Slack/email
  - `UNSUBSCRIBE`: handled before this worker (at 5.5)
- Update `Campaign.hotReplies` and `Campaign.meetings` counters
- Send Slack notification for HOT replies and meeting bookings (if Slack integration active)
- **Commit:** `feat(p8): reply handler worker with ooo parsing and referral extraction`

### Task 8.3 — Cal.com meeting booking
- `apps/api/src/services/calendar/calcom.ts`
- OAuth flow: user connects Cal.com from Settings → Integrations
- `getEventTypes(userId)` → user's active event types (15-min intro, 30-min demo, etc.)
- `getAvailableSlots(userId, eventTypeId, dateRange)` → available slots in prospect's timezone
- `createBooking(userId, eventTypeId, slot, lead)` → creates booking, returns `{ bookingUrl, confirmationUrl }`
- When AI detects a meeting request in a reply: fetch 3 available slots in the prospect's timezone, embed them in the reply as clickable links (`<a href="{bookingUrl}">Tue Jan 14, 2pm EST</a>`)
- On booking confirmed (Cal.com webhook → `POST /webhooks/calcom`): update `Lead.status = MEETING_BOOKED`, create `EmailEvent(MEETING_BOOKED)`, update CRM (if connected), notify via Slack
- Also support Calendly via their API (same interface, different implementation)
- **Commit:** `feat(p8): calcom and calendly booking with timezone-aware slot proposals`

### Task 8.4 — Inbox UI
- `(dashboard)/inbox/page.tsx` — full split-screen layout
- Left panel (thread list):
  - Tabs: All / Needs Reply / HOT / Booked / Closed
  - Each row: lead avatar (initials fallback), name + company, message snippet, time, classification badge, channel icon
  - Unread threads in bold
  - Keyboard shortcuts: `j/k` navigate threads, `r` reply, `e` mark done, `b` book meeting
- Right panel (thread view):
  - Full conversation chronologically, alternating sender alignment
  - Lead info strip: company logo, title, company, fit score, intent score, LinkedIn icon
  - AI draft reply in a TipTap editor below the thread
  - Toolbar: "Send AI Draft", "Edit & Send", "Regenerate Draft", "Book Meeting", "Mark Done", "Mark as Lost"
  - AI reasoning disclosure toggle: "Why did the AI write this?" expands to show reasoning
  - Confidence badge on AI draft (red/yellow/green)
  - Inline slot picker: click "Book Meeting" → shows 3 available slots as selectable cards → generates and sends the reply with links
  - "Compose new" button to start a fresh thread with a lead from the Leads table
- Real-time updates via SSE (new messages push instantly without page refresh)
- **Commit:** `feat(p8): inbox split-screen ui with ai draft editor and keyboard nav`

---

## Phase 9 — Buying Signal Engine

**Branch:** `phase/9-signals`
**Commit prefix:** `feat(p9):`

### Task 9.1 — Signal detector service
- `apps/api/src/services/signals/signal-detector.ts`
- Monitors 12 signal sources for companies in the workspace's lead/account lists:

  1. **LinkedIn job postings:** new jobs at target companies → `HIRING_SPREE` signal
  2. **Funding news:** Crunchbase API + Bing News for "{company} raises" → `FUNDING_ROUND` signal
  3. **Job changes:** LinkedIn profile scraper detects title/company change for known leads → `JOB_CHANGE` signal
  4. **Website visits:** tracking pixel on customer's own website (optional) or 6sense/Clearbit Reveal → `WEBSITE_VISIT`
  5. **G2 / Capterra reviews:** search for new reviews mentioning competitors → `G2_REVIEW` signal
  6. **Tech stack change:** BuiltWith API, scan monthly for new tools added → `TECH_CHANGE` signal
  7. **LinkedIn post from lead:** detect when a lead publishes a post → `LINKEDIN_POST` signal (for relevant ghostwriter comment)
  8. **News mention:** Bing News API, company name → `NEWS_MENTION`
  9. **Competitor product announcements:** RSS feeds / news for competitors in workspace → `COMPETITOR_ANNOUNCED`
  10. **Intent data:** Bombora Company Surge data via API → `INTENT_SURGE` (if Bombora integration active)
  11. **Product Hunt launch:** ProductHunt API for companies in lead list → `PRODUCT_LAUNCH`
  12. **Social mention:** Twitterapi for mentions of target companies → `TWITTER_MENTION`
- Each signal gets a `strength` score (1–10) based on how strong a purchase trigger it is
- Funding round = 9, tech change = 7, job change = 6, news mention = 4, etc.
- **Commit:** `feat(p9): 12-source buying signal detector`

### Task 9.2 — Signal-triggered automation
- `apps/api/src/services/signals/signal-automator.ts`
- Configurable rules per workspace (UI in settings):
  - "When a lead gets a `FUNDING_ROUND` signal with strength ≥ 8 → immediately enroll in sequence `Post-Funding Outreach`"
  - "When a lead gets a `JOB_CHANGE` signal → pause current sequence, enqueue a new connection request on LinkedIn"
  - "When a lead's company posts a `LINKEDIN_POST` → AI generates a relevant comment, adds as a LinkedIn action step"
  - "When `INTENT_SURGE` detected → escalate lead's intent score, notify assigned rep via Slack"
- Signal automations respect daily limits and suppression lists
- All automation actions logged as `BuyingSignal` + `EmailEvent` records
- **Commit:** `feat(p9): signal-triggered sequence automation with configurable rules`

### Task 9.3 — Buying Signals dashboard
- `(dashboard)/signals/page.tsx`
- Live feed of signals, newest first, with infinite scroll
- Each signal card: company logo, signal type icon + label, description, strength indicator, "Take Action" button (opens relevant action: enroll in sequence, send LinkedIn comment, etc.)
- Filters: signal type, strength, date range, segment, campaign
- "Signal Digest" email: weekly email (via Resend) summarising top signals from the past week
- Signal performance: which signal types lead to the most meetings (tracked via attribution)
- **Commit:** `feat(p9): buying signals dashboard with live feed and digest`

---

## Phase 10 — Account-Based Marketing (ABM)

**Branch:** `phase/10-abm`
**Commit prefix:** `feat(p10):`

### Task 10.1 — Target account management API
- `POST /accounts`: import target accounts (CSV or manual entry). Fields: name, domain, tier (1/2/3), industry, size.
- `GET /accounts`: list with intent score, signal count, stakeholder count, stage
- `POST /accounts/:id/research`: dispatches AI account research job — scrapes website, LinkedIn company, news, generates `stakeholderMap` (who to contact: executive sponsor, day-to-day champion, potential blocker, potential influencer)
- `POST /accounts/:id/find-stakeholders`: runs lead finder for all stakeholder roles in the account
- `PATCH /accounts/:id/stage`: move account through `TARGET → ENGAGED → MEETING → OPPORTUNITY → CLOSED_WON`
- **Commit:** `feat(p10): target account management api with auto research`

### Task 10.2 — Multi-threaded ABM orchestrator
- `apps/workers/src/workers/abm-orchestrator.worker.ts`
- For an ABM campaign, this worker coordinates outreach across ALL stakeholders at a target account simultaneously:
  - Tier 1 accounts (top priority): outreach to 3+ stakeholders across email + LinkedIn
  - Tier 2: outreach to 2 stakeholders via email
  - Tier 3: single contact email only
- Ensures no two people at the same company get the exact same message — each email is uniquely personalized even if the core offer is the same
- Coordinates timing: don't send to 5 people at the same company on the same day (stagger by 2+ days)
- Tracks account-level engagement: if any stakeholder replies, pause outreach to others at that company and notify the rep
- **Commit:** `feat(p10): multi-threaded abm orchestrator with account-level coordination`

### Task 10.3 — ABM accounts UI
- `(dashboard)/accounts/page.tsx`
- Kanban board view (drag cards between stages) + list view toggle
- Each account card: company logo, name, tier badge, stakeholder count, last signal, last outreach date, stage
- Account detail page:
  - Company overview panel (all researched data)
  - Stakeholder map: org chart style showing all contacts with their role (champion/sponsor/blocker), their outreach status, last reply
  - Signal timeline
  - Activity feed: every email, LinkedIn action, reply in this account
  - "Launch ABM Campaign" button
- Intent score gauge at account level (aggregated from all signals)
- **Commit:** `feat(p10): abm kanban board and account detail with stakeholder map`

---

## Phase 11 — Analytics & Revenue Intelligence

**Branch:** `phase/11-analytics`
**Commit prefix:** `feat(p11):`

### Task 11.1 — Analytics data pipeline
- Nightly BullMQ cron: aggregates `EmailEvent` into `CampaignStat` daily snapshots per campaign per channel
- `apps/api/src/services/analytics/aggregator.ts`: runs the aggregation SQL using Prisma `$queryRaw`
- Key metrics computed: open rate, click rate, reply rate, hot reply rate, meeting rate, bounce rate, unsubscribe rate, cost per lead, cost per meeting, revenue per campaign (from CRM deal values)
- Segment-level breakdown stored as JSON on `CampaignStat`
- `apps/api/src/services/analytics/attribution.ts`: when a CRM deal is closed, traces back which campaign/sequence/channel first touched that contact → updates `CampaignStat.revenue`
- **Commit:** `feat(p11): analytics aggregation pipeline with revenue attribution`

### Task 11.2 — Analytics API
- `GET /analytics/overview`: workspace-wide totals for the selected period
- `GET /analytics/funnel`: full funnel from leads found → emails sent → opened → replied → hot → meeting → closed. Returns absolute numbers + conversion rates between each stage.
- `GET /analytics/campaigns/:id`: full analytics for one campaign including segment breakdown, channel breakdown, A/B test results, timeline
- `GET /analytics/segments`: cross-campaign segment performance ranked by cost per meeting
- `GET /analytics/timeline?range=7d|30d|90d|custom`: time series with configurable metrics
- `GET /analytics/best-times`: best send times (day + hour) per channel based on open/reply rate
- `GET /analytics/email-health`: inbox placement rate, spam rate, bounce rate per sending domain
- All responses cached in Redis: overview (60s), campaign analytics (30s), segment report (120s)
- **Commit:** `feat(p11): analytics api with funnel, segments, timeline, email health`

### Task 11.3 — Analytics dashboard UI
- `(dashboard)/analytics/page.tsx`
- KPI strip: Total Leads Found, Emails Sent, Overall Reply Rate, Meetings Booked, Deals Closed (from CRM), Total Revenue Attributed, Avg Cost/Meeting, Credits Remaining
- Animated number counters on KPI cards
- Funnel visualisation: custom SVG funnel with stage labels, conversion percentages, and absolute numbers. Click a stage to filter leads at that stage.
- Timeline chart: dual-axis line chart (Recharts). Left axis: emails sent (blue). Right axis: meetings booked (amber). Date range selector.
- Segment performance table: columns for segment, sent, open%, reply%, meeting%, cost/meeting, status (scaling/working/paused), trend arrow
- Channel comparison radar chart: Email vs LinkedIn vs SMS across 5 dimensions
- Best send times heat map: day-of-week × hour-of-day grid coloured by reply rate
- A/B test results table: for each running test, variant name, sent count, open rate, reply rate, winner badge (once significant), confidence %
- Campaign leaderboard: ranked by ROI (revenue / spend)
- All charts follow dataviz skill: dark background, accessible colours, no chartjunk
- **Commit:** `feat(p11): full analytics dashboard with all chart types`

### Task 11.4 — AI Campaign Coach
- `apps/api/src/services/ai/campaign-coach.ts`
- Runs after every 100 emails sent per campaign
- Analyses performance data: which subject lines perform best, which email openings get replies, which segments underperform, which send times work
- Generates 3–5 specific actionable recommendations:
  - "Your subject lines with questions get 2× more opens. Try: [suggested subject]"
  - "The 'Event designers' segment hasn't replied after 150 sends. Consider refreshing the outreach angle to: [new angle]"
  - "Tuesday at 10am in your prospects' timezone has the highest reply rate. Shift your send window to 9:30–11am Tue/Wed."
- Suggestions displayed as a notification in the app and optional weekly email digest
- "Apply all suggestions" button: AI automatically rewrites underperforming templates and adjusts send windows
- **Commit:** `feat(p11): ai campaign coach with actionable recommendations and auto-apply`

### Task 11.5 — A/B testing engine
- Each sequence email step supports up to 4 subject line variants
- `apps/api/src/services/analytics/ab-tester.ts`:
  - Assigns leads to variants randomly (uniform distribution)
  - Every 6 hours: runs chi-squared test on reply rates (not just open rates — replies matter more)
  - Pauses losing variants when statistical confidence ≥ 95% with at least 50 sends per variant
  - Marks winner, routes all remaining leads to winner
  - Logs results to `EmailVariant` table
- UI in campaign detail page: "A/B Tests" tab showing all running + completed tests with confidence intervals visualised
- **Commit:** `feat(p11): a/b testing engine with chi-squared significance and auto-winner`

---

## Phase 12 — Integrations

**Branch:** `phase/12-integrations`
**Commit prefix:** `feat(p12):`

### Task 12.1 — HubSpot CRM integration
- OAuth flow from Settings → Integrations
- Two-way sync rules (user-configurable):
  - **Lead → Contact:** when `Lead.status = REPLIED`, upsert HubSpot Contact with all fields
  - **HOT reply → Deal:** create/move Deal to "Interested" pipeline stage
  - **Meeting booked → Deal stage:** move to "Meeting Scheduled"
  - **Deal closed won in HubSpot → revenue attribution:** sync close value back to `CampaignStat.revenue`
  - **DNC in HubSpot → suppression:** if HubSpot contact has `GDPR opt-out = true`, add to suppression list
- Field mapping UI: user maps our fields to their HubSpot properties
- Sync logs: last 50 sync events with status
- **Commit:** `feat(p12): hubspot two-way crm sync with field mapping`

### Task 12.2 — Salesforce integration
- OAuth 2.0 flow (Salesforce Connected App)
- Sync: Lead → SF Lead → SF Contact → SF Opportunity (same logic as HubSpot)
- Supports both Salesforce Classic and Lightning
- Custom field sync: user defines which custom fields to map
- **Commit:** `feat(p12): salesforce integration with lead-to-opportunity sync`

### Task 12.3 — Pipedrive integration
- API key authentication (simpler than OAuth)
- Sync: Lead → Person → Deal in Pipedrive
- Stage progression matches HubSpot logic
- **Commit:** `feat(p12): pipedrive integration`

### Task 12.4 — Slack integration
- OAuth flow
- Configurable per workspace:
  - Channel for HOT reply alerts: `[🔥 HOT REPLY] Wole Fagbohun at PlotWeaver replied! [View in Inbox]`
  - Channel for meeting bookings: `[📅 MEETING BOOKED] Jack Deakin from Revest — Tue Jan 14 at 2pm EST`
  - Channel for buying signals: strength ≥ 8 signals
  - Weekly digest: every Monday 8am, summary of last week
- Interactive buttons in Slack messages: "View Reply", "Book Meeting", "Mark as Done" (uses Slack Block Kit actions → webhook → our API)
- **Commit:** `feat(p12): slack integration with interactive notifications`

### Task 12.5 — Zapier + Make + n8n webhooks
- `POST /webhooks/zapier/trigger`: used in Zapier "New Hot Reply" trigger, "New Meeting Booked" trigger
- `GET /webhooks/zapier/leads`: Zapier "Find Lead" search action
- `POST /webhooks/zapier/leads`: Zapier "Create Lead" action (to add leads from external sources)
- Make (Integromat): same endpoints, documented in our API docs
- n8n: publish official n8n community node (publish to npm as `n8n-nodes-forgeai`)
- Full Zapier OAuth app submitted to Zapier marketplace
- **Commit:** `feat(p12): zapier make n8n integration with trigger and action support`

### Task 12.6 — Google Workspace + Microsoft integration
- Google Calendar OAuth: read/write calendar for meeting booking (alternative to Cal.com)
- Google Contacts sync: import contacts from Google Contacts as leads
- Microsoft Outlook integration: read sent/received emails from Outlook for inbox sync
- Microsoft Teams: same as Slack integration (Task 12.4) but for Teams channels
- **Commit:** `feat(p12): google workspace and microsoft teams integration`

---

## Phase 13 — Conversation Intelligence (Call Recording)

**Branch:** `phase/13-call-intelligence`
**Commit prefix:** `feat(p13):`

### Task 13.1 — Twilio dialer
- `apps/api/src/services/channels/dialer.ts`
- Twilio Programmable Voice: click-to-call from lead detail page
- Records the call (Twilio call recording)
- Transcript stored on Twilio, downloaded after call ends
- `POST /webhooks/twilio/call-status`: receives call status updates from Twilio
- On `status = completed`: dispatch `CALL_TRANSCRIBER` job
- Credits: $0.10 per minute of call
- **Commit:** `feat(p13): twilio click-to-call dialer with auto-recording`

### Task 13.2 — Call transcription + AI analysis
- `apps/workers/src/workers/call-transcriber.worker.ts`
- Download recording from Twilio
- Transcribe using OpenAI Whisper API (speaker diarisation)
- Pass transcript to Claude with prompt:
  - Generate 3-sentence summary
  - Extract next steps / action items (as a list)
  - Extract objections raised by prospect
  - Overall sentiment score
  - Draft a follow-up email based on what was discussed
- Store everything in `CallRecording` model
- Auto-update CRM: add a note to the Contact/Deal with the summary and next steps
- Notify user in-app with "Your call with [Name] has been transcribed. [View summary]"
- **Commit:** `feat(p13): call transcription with ai summary, objections, follow-up draft`

### Task 13.3 — Call intelligence UI
- Lead detail panel now has a "Calls" tab:
  - List of all recorded calls with date, duration, sentiment chip
  - Click to expand: full AI summary, next steps checklist (user can tick off), objections list, AI-drafted follow-up email with "Send this email" button
  - Full transcript viewer with speaker labels and timestamps
  - Search transcript (find any keyword)
- `(dashboard)/analytics/calls/page.tsx`:
  - Total calls, avg duration, avg sentiment, top objections across all calls
  - Objection frequency chart: which objections come up most
  - Conversion rate: calls → meetings → closed
- **Commit:** `feat(p13): call intelligence ui with transcript viewer and objection analytics`

---

## Phase 14 — Billing, Credits & Pricing

**Branch:** `phase/14-billing`
**Commit prefix:** `feat(p14):`

### Task 14.1 — Credit cost model
Implement the following credit costs — all deducted from `Workspace.credits`:

| Action | Cost |
|---|---|
| Email sent | $0.015 |
| Email verified (waterfall hit past source 3) | $0.002 |
| LinkedIn connection request | $0.02 |
| LinkedIn message | $0.025 |
| SMS sent | $0.05 |
| Outbound call (per minute) | $0.10 |
| AI deep research (per lead) | $0.005 |
| Video thumbnail generated | $0.01 |
| Free trial | $30 in credits |

Every debit writes a `CreditTransaction` row. Never send if `Workspace.credits < 0`. Enforce pre-flight check before dispatching any job that will consume credits.
- **Commit:** `feat(p14): credit cost model with pre-flight balance check`

### Task 14.2 — Stripe integration
- `apps/api/src/services/billing/stripe.ts`
- Credit packs (one-time purchases, shown in Pricing page):
  - Starter: $30 (= 2,000 emails)
  - Growth: $100 (= 6,666 emails)
  - Scale: $250 (= 16,666 emails, + 10% bonus credits)
  - Pro: $500 (= 33,333 emails, + 15% bonus)
  - Agency: $1,000 (= 66,666 emails, + 20% bonus)
- `POST /billing/checkout`: create Stripe Checkout Session for credit pack
- `POST /webhooks/stripe`: handle `checkout.session.completed` → add credits, create `CreditTransaction`
- `GET /billing/transactions`: paginated transaction history
- `GET /billing/estimate`: given campaign settings → estimated total cost
- Auto top-up: user can configure "auto-buy $100 credits when balance drops below $20"
- **Commit:** `feat(p14): stripe credit packs with checkout, webhooks, auto top-up`

### Task 14.3 — Onboarding & free trial flow
- After sign-up: redirect to `/onboarding`
- Onboarding is a focused full-screen flow (no sidebar):
  1. Welcome + value prop ("30-second pitch, not a form")
  2. "Paste your website" — URL input
  3. Analysis loading (animated, real messages)
  4. ICP preview (3 best segments as preview cards)
  5. Email style quick-pick (3 preset styles: Professional / Casual / Bold)
  6. Trial activation: "$30 free credits — let the AI run for you." → Stripe Payment Element (Stripe's hosted input component, never see raw card data) with messaging: "You won't be charged now. $0.015/email after your credits run out."
  7. Launch screen with confetti → redirect to campaign dashboard
- Onboarding progress tracked in `User.onboardingStep`
- If user skips at any step, show a resume banner on next login
- **Commit:** `feat(p14): onboarding flow with free trial stripe activation`

### Task 14.4 — Billing & pricing UI
- `(dashboard)/billing/page.tsx`:
  - Large credit balance display with low-balance warning (< $10 = amber, < $5 = red)
  - "Add Credits" → opens credit pack modal (animated pack cards with recommended badge on Growth)
  - Auto top-up toggle with threshold and amount selectors
  - Spend by campaign chart (stacked bar, Recharts)
  - Transaction table: type icon, description, amount, balance after, date
  - Export transactions as CSV
- `/pricing` (public page):
  - Pay-as-you-go section with cost comparison table vs Apollo, Instantly, Lemlist
  - Interactive calculator: drag email volume slider → live cost vs estimated results
  - Credit pack cards with "Best value" badge
  - Feature table: what's included at each credit tier
  - FAQ section (inline accordion)
- **Commit:** `feat(p14): billing dashboard and public pricing page`

---

## Phase 15 — White-Label & Agency

**Branch:** `phase/15-agency`
**Commit prefix:** `feat(p15):`

### Task 15.1 — Multi-workspace
- All campaigns, leads, settings, credits fully scoped to a `Workspace`
- User can be a member of multiple workspaces (e.g. agency + personal)
- Workspace switcher in the top bar: shows avatar, workspace name, plan badge
- "Create new workspace" from the switcher: name + optional logo upload → creates workspace + adds user as OWNER
- Invite team members: `POST /workspaces/invite` → sends email (Resend) with accept link
- Roles: OWNER (all permissions), ADMIN (all except billing + delete workspace), MEMBER (create + run campaigns), VIEWER (read only)
- **Commit:** `feat(p15): multi-workspace with roles and email invitations`

### Task 15.2 — White-label branding
- Agency plan unlocks: custom logo upload, custom primary color (hex picker with WCAG contrast check), custom workspace name, custom domain
- Custom domain flow:
  1. User enters `app.theiragency.com`
  2. We show them a CNAME record to add: `app.theiragency.com CNAME forge-white.vercel.app`
  3. Vercel Domains API: add domain to our Vercel project
  4. Poll DNS propagation → mark verified
  5. SSL auto-provisioned by Vercel
- On custom domain: all "Forge AI" branding replaced by workspace logo + name. Emails from the platform use workspace branding.
- **Commit:** `feat(p15): white-label with custom domain, logo, colors`

### Task 15.3 — Client reports (PDF)
- `apps/api/src/services/reports/pdf-generator.ts`
- Uses Puppeteer to render a Next.js `/reports/:campaignId` page (server-side, bypasses auth for signed tokens) to PDF
- Report sections: Executive Summary, Campaign Overview, Results Table, Channel Breakdown, Top Performing Leads, Recommendations, Cost Summary
- Workspace branding applied (logo, colors) — white-label ready
- Stored on Cloudflare R2 for 7 days
- `GET /campaigns/:id/report.pdf?token={signedToken}`: streams PDF
- UI: "Generate Report" button on campaign detail page with a date range picker
- **Commit:** `feat(p15): branded pdf client report with puppeteer`

### Task 15.4 — Sub-account management
- Agency plan: master workspace can create sub-workspaces (clients)
- `(dashboard)/agency/page.tsx`: list all client workspaces with health summary (active campaigns, credits, last activity)
- Master workspace admin can:
  - Add credits to a client workspace
  - View all campaigns in a client workspace (read-only unless given access)
  - Generate reports for any client workspace
  - Set custom sending domain per client workspace
- Billing: agency is billed for all sub-workspace credit usage under one Stripe account
- **Commit:** `feat(p15): agency sub-account management with credit delegation`

---

## Phase 16 — Global Compliance Engine

**Branch:** `phase/16-compliance`
**Commit prefix:** `feat(p16):`

### Task 16.1 — Region detection and compliance routing
- `apps/api/src/services/compliance/region-detector.ts`
- For each lead, detect compliance region from:
  1. `Lead.country` (from enrichment)
  2. `Lead.companyDomain` TLD (`.de` → Germany → EU, `.ca` → Canada, `.br` → Brazil, etc.)
  3. IP geolocation fallback (IPinfo.io API)
- Sets `Lead.complianceRegion`: `EU | UK | US | CA | AU | BR | SG | TH | GLOBAL`
- **Commit:** `feat(p16): compliance region detection per lead`

### Task 16.2 — Per-region compliance rules engine
- `apps/api/src/services/compliance/rules-engine.ts`
- Enforces rules before any email is sent:

  **EU / GDPR:**
  - B2B emails: legal under "legitimate interest" — require a legitimate interest assessment logged in `ComplianceLog`
  - Must include: sender's real name + company address, unsubscribe link, physical address
  - Data retention: leads must be deleted or anonymised if no engagement in 12 months
  - Right to erasure: `DELETE /leads/:id/gdpr-erase` anonymises all PII

  **Canada / CASL:**
  - Must have express or implied consent for B2B (implied = publicly listed business email)
  - Must include: identification info, unsubscribe mechanism with 10-day processing window
  - Log every consent basis in `ComplianceLog`

  **USA / CAN-SPAM:**
  - Must include: physical mailing address, unsubscribe that works within 10 business days, accurate From/Reply-To, non-deceptive subject lines
  - B2B commercial email is broadly allowed

  **California / CCPA:**
  - "Do Not Sell My Personal Information" link in footer
  - Process erasure requests within 45 days

  **Brazil / LGPD:**
  - Similar to GDPR — legitimate interest for B2B, consent logging

  **Australia / Spam Act:**
  - Commercial emails must have consent (express or inferred), clear identification, unsubscribe

- All outbound emails have a compliance footer auto-injected based on region (correct address, unsubscribe wording per jurisdiction)
- Bulk compliance scan: nightly job flags leads with expired consent or missing compliance data
- **Commit:** `feat(p16): per-region compliance rules with auto footer injection`

### Task 16.3 — Compliance dashboard
- `(dashboard)/settings/compliance/page.tsx`
- Compliance health score per region (% of leads in that region that are compliant)
- Pending actions: leads needing consent renewal, erasure requests, DNC list conflicts
- Audit log: every compliance action with timestamp, userId, email, action type
- Data retention settings: configure auto-anonymise periods per region
- "Run compliance sweep" button: triggers `COMPLIANCE_SWEEP` job across all leads
- Download GDPR Data Subject Access Report: all data held on a specific email address
- **Commit:** `feat(p16): compliance dashboard with audit log and dsar export`

---

## Phase 17 — Chrome Extension

**Branch:** `phase/17-extension`
**Commit prefix:** `feat(p17):`

### Task 17.1 — Extension scaffold + auth
- Build with WXT framework (Manifest V3, React + Tailwind)
- Auth: user signs into the extension using their Forge AI credentials (API key from settings)
- Content scripts activate on: `linkedin.com`, `apollo.io`, `hunter.io`, company websites
- Popup UI: mini version of the Forge AI dashboard — credit balance, quick stats, quick actions
- **Commit:** `feat(p17): chrome extension scaffold with wxt and auth`

### Task 17.2 — LinkedIn prospecting overlay
- On `linkedin.com/in/*` (profile pages): inject a sidebar panel:
  - Show lead's Forge AI record if they already exist
  - If not: show enrichment data fetched live (name, title, company)
  - "Add to Campaign" button → opens campaign selector → creates lead → dispatches enrichment → shows "Added!" confirmation
  - Show all buying signals for this person
  - Show if they're already in a sequence, and at which step
- On `linkedin.com/search/results/people/`: inject an "Add all to Forge AI" button that bulk-adds the visible results
- On LinkedIn feed: inject a "Signal" icon next to posts from people in lead lists
- **Commit:** `feat(p17): linkedin prospecting overlay with add-to-campaign`

### Task 17.3 — Apollo / website enrichment overlay
- On `app.apollo.io/contacts`: inject an "Export to Forge AI" button on the contacts table — exports selected contacts directly to a campaign
- On any company website: if the domain matches a target account or lead's company, show a mini panel: "This is a target account. [3 signals]. [2 leads here]."
- On any LinkedIn company page: show account tier, stage, and open signals
- **Commit:** `feat(p17): apollo export button and website company overlay`

---

## Phase 18 — Mobile Notifications

**Branch:** `phase/18-mobile`
**Commit prefix:** `feat(p18):`

### Task 18.1 — Web push notifications
- `apps/api/src/services/notifications/push.ts`
- Use the Web Push API (VAPID keys) via `web-push` npm library
- Subscribe users to push on first login (browser permission prompt, non-intrusive timing — ask after first HOT reply)
- Notification types: HOT reply received, meeting booked, campaign finished, credits low
- Store push subscriptions in `User` model (JSON field `pushSubscriptions[]`)
- **Commit:** `feat(p18): web push notifications with vapid`

### Task 18.2 — In-app notification centre
- Bell icon in top bar shows unread count badge
- Notifications dropdown (Popover): last 20 notifications with unread highlighting
- Types with icons: 🔥 HOT reply, 📅 Meeting booked, ⚡ Signal detected, ⚠️ Credits low, ✅ Campaign complete, 🏆 A/B test winner found
- "Mark all read", individual dismiss
- Clicking a notification navigates to the relevant page
- Delivered via SSE (same connection as inbox updates)
- Persisted in `Notification` DB table
- **Commit:** `feat(p18): in-app notification centre with sse delivery`

---

## Phase 19 — Performance, Security & Reliability

**Branch:** `phase/19-hardening`
**Commit prefix:** `chore(p19):`

### Task 19.1 — Performance optimisation
- Redis caching: add cache layer on all analytics endpoints (TTLs in section 11.2), campaign list, workspace settings
- Database: add indexes for all foreign keys and frequently filtered fields. Run `EXPLAIN ANALYZE` on the 10 most common queries and optimise.
- N+1 query audit: grep codebase for `await prisma.X.findMany` in loops → convert to `include` or batch queries
- Next.js: convert all dashboard pages to React Server Components where possible. Use `Suspense` + streaming. Add `revalidate` tags.
- BullMQ: tune `concurrency` per worker based on expected load. Email sender: concurrency 20. Deep research: concurrency 5 (AI rate limited).
- Typesense: ensure lead search index is populated on lead create/update. Index only: firstName, lastName, email, company, title.
- **Commit:** `chore(p19): performance pass — redis caching, db indexes, n+1 fixes, rsc conversion`

### Task 19.2 — Security hardening
- All user-supplied HTML (email templates): run through DOMPurify server-side before storing
- All SMTP credentials, OAuth tokens, API keys, LinkedIn cookies: AES-256-GCM encrypted at rest. Key in `ENCRYPTION_KEY` env (32-byte hex). Never stored plain.
- API key hashing: store only `sha256(key)` in DB. Show key once at creation, never again.
- SSRF protection on website analyzer: block requests to private IP ranges (10.x, 172.16.x, 192.168.x, localhost)
- Rate limiting:
  - Public API: 100 req/min per API key
  - Auth endpoints: 10 req/min per IP
  - AI-intensive endpoints (website analyze, email preview): 10 req/hour per workspace
- CSRF: Fastify CSRF protection on all state-changing routes
- Security headers: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`
- Dependency audit: `pnpm audit` in CI. Fail build on critical/high CVEs.
- `DELETE /account/gdpr-erase`: hard-delete all PII for a user. Anonymise lead records (replace with hashed values). Cancel Stripe subscription. Revoke Clerk user. Complete within 72h (log start/completion).
- **Commit:** `chore(p19): security — encryption, ssrf protection, rate limits, headers, gdpr erase`

### Task 19.3 — Test coverage
- Framework: Vitest for unit + integration. Playwright for E2E.
- Target coverage: 80% for all service files. 100% for billing, compliance, and auth flows.
- Unit tests: every service file has a co-located `*.test.ts`. Mock: Anthropic client, Stripe, SMTP, all external APIs.
- Integration tests: spin up test DB (Docker Postgres), run full campaign create → lead find → email write → email send flow end-to-end.
- E2E tests (Playwright): onboarding flow, campaign creation wizard, inbox reply + book meeting flow, billing checkout, compliance opt-out.
- **Commit:** `chore(p19): full test coverage — unit, integration, e2e`

### Task 19.4 — Observability
- Sentry: install in `apps/web` (Sentry browser SDK with session replay) and `apps/api` (Fastify plugin). Capture all unhandled errors + performance traces.
- Axiom: structured JSON logging from Fastify. Log every request (method, path, status, latency), every BullMQ job (queue, jobId, status, duration), every Claude API call (tokens used, latency, model).
- BullBoard: at `GET /admin/queues` — lists all queues, job counts by status, failed job inspector with stack trace, retry button. Protected by `role = OWNER` check.
- Uptime monitoring: BetterUptime pings `/health` every 60s from 5 global regions. PagerDuty alert on 2 consecutive failures.
- Alert thresholds: API error rate > 1% → Slack alert. BullMQ failure rate > 5% per queue → Slack alert. Database pool exhaustion → PagerDuty.
- **Commit:** `chore(p19): sentry, axiom, bullboard, uptime monitoring`

---

## Phase 20 — CI/CD & Launch

**Branch:** `phase/20-launch`
**Commit prefix:** `chore(p20):`

### Task 20.1 — GitHub Actions CI
`.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env: { POSTGRES_DB: forge_test, POSTGRES_PASSWORD: test }
        ports: ['5432:5432']
      redis:
        image: redis:7
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```
- **Commit:** `chore(p20): github actions ci with postgres and redis services`

### Task 20.2 — Deploy pipeline
`.github/workflows/deploy.yml`:
- On push to `main`:
  1. Run `prisma migrate deploy` (Railway's DATABASE_URL)
  2. Deploy `apps/api` + `apps/workers` to Railway via `railway up`
  3. Deploy `apps/web` to Vercel via `vercel deploy --prod`
  4. Smoke test: `curl https://api.forgeai.io/health` → assert `status: ok`
  5. Notify Slack: `#deployments` channel with version + deploy duration
- Environment variables managed via Doppler — inject into Railway + Vercel at deploy time
- **Commit:** `chore(p20): deploy pipeline with db migrations and smoke tests`

### Task 20.3 — Launch checklist (verify all before going live)
- [ ] All 20 phases merged to `main` and CI green
- [ ] Database migrations applied to production
- [ ] 20+ platform pool sending domains provisioned and warmed
- [ ] 200+ seed mailboxes active for warming network
- [ ] Stripe live mode enabled, webhook secret updated
- [ ] Clerk production instance configured
- [ ] All external API keys are production keys (not test/sandbox)
- [ ] GDPR privacy policy and terms of service pages live at `/privacy` and `/terms`
- [ ] Unsubscribe endpoint tested end-to-end
- [ ] Compliance footer verified for EU, US, CA, AU regions
- [ ] Sentry DSN points to production project
- [ ] Axiom production dataset configured
- [ ] BetterUptime monitoring active from 5 regions
- [ ] Custom error pages: `/404`, `/500`, `/maintenance`
- [ ] PostHog analytics tracking key events: `campaign_created`, `lead_found`, `email_sent`, `meeting_booked`, `credit_purchased`
- [ ] Lighthouse score ≥ 90 for dashboard and landing page
- [ ] Rate limits tested (verify 429 responses)
- [ ] SSRF protection tested (verify blocked private IP requests)
- [ ] Security headers verified via securityheaders.com
- [ ] Chrome extension published to Chrome Web Store
- [ ] `/pricing` and `/` landing page live with waitlist or immediate signup
- **Commit:** `chore(p20): launch — all checklist items verified`

---

## 6. Environment Variables (complete)

Create `.env.example` at repo root:

```bash
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:3001
ENCRYPTION_KEY=   # 32-byte hex string

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...  # for prisma migrations bypassing pgbouncer

# Redis
REDIS_URL=redis://...

# Auth (Clerk)
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_WEBHOOK_SECRET=

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Contact enrichment
APOLLO_API_KEY=
HUNTER_API_KEY=
CLEARBIT_API_KEY=
ZEROBOUNCE_API_KEY=
MILLIONVERIFIER_API_KEY=
SNOV_USER_ID=
SNOV_SECRET=
SKRAPP_API_KEY=
ROCKETREACH_API_KEY=
LUSHA_API_KEY=
CONTACTOUT_API_KEY=
ENROW_API_KEY=
FINDYMAIL_API_KEY=
BUILTWITH_API_KEY=
RAPIDAPI_KEY=   # for LinkedIn scraper + others

# Buying Signals
BOMBORA_API_KEY=
CRUNCHBASE_API_KEY=
BING_SEARCH_API_KEY=
PRODUCTIONHUNT_TOKEN=
TWITTER_BEARER_TOKEN=

# Email infrastructure
NAMECHEAP_API_USER=
NAMECHEAP_API_KEY=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ZONE_ID=
INBOUND_EMAIL_DOMAIN=inbound.forgeai.io

# Tracking
TRACKING_BASE_URL=https://t.forgeai.io

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Calendar
CALCOM_CLIENT_ID=
CALCOM_CLIENT_SECRET=
CALENDLY_CLIENT_ID=
CALENDLY_CLIENT_SECRET=

# Phone
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# CRM
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=

# Communication
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_DEPLOY_WEBHOOK_URL=

# Storage
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_PUBLIC_URL=

# Transactional email
RESEND_API_KEY=

# Video
ELEVENLABS_API_KEY=

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
AXIOM_TOKEN=
AXIOM_ORG_ID=
POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_KEY=

# Search
TYPESENSE_HOST=
TYPESENSE_API_KEY=

# Web Push
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Admin
ADMIN_SECRET=   # for /admin/* routes
```

---

## 7. Definition of Done

### Per task:
- [ ] Feature works correctly in local development
- [ ] TypeScript compiles: `pnpm typecheck` passes with zero errors
- [ ] Linting: `pnpm lint` passes with zero warnings
- [ ] Tests written and passing: `pnpm test` green
- [ ] No hardcoded secrets, no console.log left in production code
- [ ] Commit message follows format and references phase/task number
- [ ] Pushed to GitHub

### Per phase:
- [ ] All tasks complete
- [ ] Pull Request opened
- [ ] CI passes (typecheck + lint + test + build)
- [ ] PR description summarises what was built
- [ ] Merged to `main`

### Whole product:
- [ ] All 20 phases merged
- [ ] Phase 20.3 launch checklist fully verified
- [ ] Product is live, accessible, payments processing, emails sending
- [ ] All compliance regions handling correctly
- [ ] Monitoring and alerting active

---

## 8. Key Architectural Decisions

1. **Credits at workspace level, not user level.** Teams share a pool. Simpler billing, better for agency use case.
2. **Workers are a separate deployable from the API.** The API stays fast (never blocked by long AI jobs). Scale workers independently.
3. **All AI calls use Claude as primary, OpenAI as fallback.** If Claude API is down, the fallback kicks in automatically. Wrap in a `callAI(prompt, options)` function that handles this transparently.
4. **Liquid templates, not React in emails.** Simpler, faster, works across all email clients, easier for non-technical users to edit.
5. **SSE for real-time, not WebSockets.** SSE is simpler to implement, works through load balancers and proxies, sufficient for our unidirectional update pattern.
6. **Typesense for lead search, not Postgres full-text.** Postgres full-text is slow at 100k+ leads. Typesense is fast, handles typos, and is free to self-host.
7. **All enrichment results cached in Redis.** The same lead from Apollo will be searched by multiple customers. Caching saves API costs significantly.
8. **Compliance footer injected at send time.** Never stored in the template — it changes based on the recipient's region. This guarantees the correct legal text is always used even if the template was created before a region was supported.
9. **Sequence runner runs every 5 minutes, not on a per-lead cron.** One sweep processes all due enrollments efficiently. At scale, add more concurrency to this worker rather than more job frequency.
10. **A/B winner detection uses reply rate, not open rate.** Open rates are unreliable (pixel blocking, Apple MPP). Reply rate is a true signal of message quality.

---

*Build this and you will have a product that beats every competitor in the market. Scope is deliberately complete — do not skip phases.*
