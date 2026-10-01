import {
  type EmailStatus,
  type LeadStatus,
  type LinkedInStatus,
  type Prisma,
  PrismaClient,
} from '@prisma/client'

const prisma = new PrismaClient()

const WORKSPACE_ID = 'seed_workspace'
const USER_ID = 'seed_admin_user'
const CAMPAIGN_ID = 'seed_demo_campaign'
const DOMAIN = 'getforgedemo.io'
const STAT_DAYS = 30

interface SeedLead {
  firstName: string
  lastName: string
  company: string
  companyDomain: string
  title: string
  seniority: string
  industry: string
  companySize: string
  country: string
  segment: string
  fitScore: number
  intentScore: number
  status: LeadStatus
  emailStatus: EmailStatus
  linkedinStatus: LinkedInStatus
  techStack: string[]
}

// One lead per status so every badge and filter in the UI has data behind it.
const LEADS: SeedLead[] = [
  {
    firstName: 'Maya',
    lastName: 'Okafor',
    company: 'Lumen Analytics',
    companyDomain: 'lumenanalytics.test',
    title: 'VP of Sales',
    seniority: 'vp',
    industry: 'Software',
    companySize: '51-200',
    country: 'US',
    segment: 'B2B SaaS sales leaders',
    fitScore: 92,
    intentScore: 78,
    status: 'HOT',
    emailStatus: 'REPLIED',
    linkedinStatus: 'CONNECTED',
    techStack: ['HubSpot', 'Segment', 'Snowflake'],
  },
  {
    firstName: 'Jonas',
    lastName: 'Weber',
    company: 'Kettle Logistics',
    companyDomain: 'kettlelogistics.test',
    title: 'Head of Growth',
    seniority: 'director',
    industry: 'Logistics',
    companySize: '201-500',
    country: 'DE',
    segment: 'Logistics growth teams',
    fitScore: 84,
    intentScore: 61,
    status: 'MEETING_BOOKED',
    emailStatus: 'REPLIED',
    linkedinStatus: 'REPLIED',
    techStack: ['Salesforce', 'Outreach'],
  },
  {
    firstName: 'Priya',
    lastName: 'Raman',
    company: 'Northwind Health',
    companyDomain: 'northwindhealth.test',
    title: 'Chief Revenue Officer',
    seniority: 'c_suite',
    industry: 'Healthcare',
    companySize: '501-1000',
    country: 'US',
    segment: 'Healthtech revenue leaders',
    fitScore: 88,
    intentScore: 55,
    status: 'WARM',
    emailStatus: 'CLICKED',
    linkedinStatus: 'MESSAGE_SENT',
    techStack: ['Salesforce', 'Gong'],
  },
  {
    firstName: 'Tomás',
    lastName: 'Silva',
    company: 'Brisa Pagamentos',
    companyDomain: 'brisapagamentos.test',
    title: 'Sales Director',
    seniority: 'director',
    industry: 'Fintech',
    companySize: '51-200',
    country: 'BR',
    segment: 'Fintech sales directors',
    fitScore: 79,
    intentScore: 40,
    status: 'REPLIED',
    emailStatus: 'REPLIED',
    linkedinStatus: 'CONNECTION_SENT',
    techStack: ['Pipedrive', 'Stripe'],
  },
  {
    firstName: 'Hannah',
    lastName: 'Lindqvist',
    company: 'Fjord Robotics',
    companyDomain: 'fjordrobotics.test',
    title: 'Founder & CEO',
    seniority: 'owner',
    industry: 'Robotics',
    companySize: '11-50',
    country: 'SE',
    segment: 'Deep-tech founders',
    fitScore: 73,
    intentScore: 32,
    status: 'ACTIVE',
    emailStatus: 'OPENED',
    linkedinStatus: 'NOT_STARTED',
    techStack: ['HubSpot'],
  },
  {
    firstName: 'Darius',
    lastName: 'Chen',
    company: 'Orbit Commerce',
    companyDomain: 'orbitcommerce.test',
    title: 'Revenue Operations Manager',
    seniority: 'manager',
    industry: 'E-commerce',
    companySize: '201-500',
    country: 'CA',
    segment: 'E-commerce RevOps',
    fitScore: 81,
    intentScore: 47,
    status: 'ACTIVE',
    emailStatus: 'SENT',
    linkedinStatus: 'NOT_STARTED',
    techStack: ['Shopify', 'Klaviyo', 'HubSpot'],
  },
  {
    firstName: 'Amelia',
    lastName: 'Grant',
    company: 'Harbor Legal',
    companyDomain: 'harborlegal.test',
    title: 'Managing Partner',
    seniority: 'owner',
    industry: 'Legal Services',
    companySize: '11-50',
    country: 'GB',
    segment: 'Professional services owners',
    fitScore: 66,
    intentScore: 18,
    status: 'APPROVED',
    emailStatus: 'QUEUED',
    linkedinStatus: 'NOT_STARTED',
    techStack: ['Clio'],
  },
  {
    firstName: 'Kenji',
    lastName: 'Watanabe',
    company: 'Sakura Systems',
    companyDomain: 'sakurasystems.test',
    title: 'Director of Business Development',
    seniority: 'director',
    industry: 'Software',
    companySize: '1001-5000',
    country: 'JP',
    segment: 'B2B SaaS sales leaders',
    fitScore: 70,
    intentScore: 25,
    status: 'PENDING',
    emailStatus: 'NOT_SENT',
    linkedinStatus: 'NOT_STARTED',
    techStack: ['Salesforce', 'Marketo'],
  },
  {
    firstName: 'Sofia',
    lastName: 'Marchetti',
    company: 'Vela Hospitality',
    companyDomain: 'velahospitality.test',
    title: 'Commercial Director',
    seniority: 'director',
    industry: 'Hospitality',
    companySize: '201-500',
    country: 'IT',
    segment: 'Hospitality commercial teams',
    fitScore: 58,
    intentScore: 12,
    status: 'COLD',
    emailStatus: 'OPENED',
    linkedinStatus: 'NOT_STARTED',
    techStack: ['Zoho CRM'],
  },
  {
    firstName: 'Marcus',
    lastName: 'Bell',
    company: 'Ironclad Supply',
    companyDomain: 'ironcladsupply.test',
    title: 'VP of Partnerships',
    seniority: 'vp',
    industry: 'Manufacturing',
    companySize: '501-1000',
    country: 'US',
    segment: 'Manufacturing partnerships',
    fitScore: 64,
    intentScore: 8,
    status: 'BOUNCED',
    emailStatus: 'BOUNCED',
    linkedinStatus: 'NOT_STARTED',
    techStack: ['SAP'],
  },
]

const MAILBOX_NAMES = [
  { local: 'alex', displayName: 'Alex Morgan' },
  { local: 'sarah', displayName: 'Sarah Bennett' },
  { local: 'james', displayName: 'James Carter' },
]

/** Deterministic PRNG so repeated seeds produce the same stats. */
function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function utcDay(daysAgo: number): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo))
}

function slugify(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

async function seedWorkspaceAndUser() {
  const workspace = await prisma.workspace.upsert({
    where: { id: WORKSPACE_ID },
    update: {},
    create: {
      id: WORKSPACE_ID,
      name: 'Forge Demo',
      slug: 'forge-demo',
      plan: 'GROWTH',
      credits: 30,
    },
  })

  const user = await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: {
      id: USER_ID,
      clerkId: 'seed_clerk_admin',
      email: 'admin@forge-demo.test',
      name: 'Demo Admin',
      role: 'ADMIN',
      plan: 'GROWTH',
      onboardingDone: true,
    },
  })

  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
      acceptedAt: new Date(),
    },
  })

  await prisma.creditTransaction.upsert({
    where: { id: 'seed_free_trial_tx' },
    update: {},
    create: {
      id: 'seed_free_trial_tx',
      workspaceId: workspace.id,
      userId: user.id,
      amount: 30,
      balanceAfter: 30,
      type: 'free_trial',
      description: 'Free trial credits',
    },
  })

  return { workspace, user }
}

async function seedCampaign(workspaceId: string, userId: string) {
  const segments = [...new Set(LEADS.map((lead) => lead.segment))]
  const campaign: Prisma.CampaignUncheckedCreateInput = {
    id: CAMPAIGN_ID,
    workspaceId,
    name: 'Demo — Outbound to revenue leaders',
    websiteUrl: 'https://forge-demo.test',
    status: 'RUNNING',
    mode: 'MANUAL',
    channels: ['EMAIL', 'LINKEDIN'],
    dailySendCap: 100,
    createdBy: userId,
    websiteAnalysis: {
      companyName: 'Forge Demo',
      tagline: 'Outbound on autopilot',
      productDescription: 'An AI platform that finds, researches and contacts ideal customers.',
      industry: 'Software',
      pricingModel: 'usage',
    },
    icp: segments.map((name, index) => ({
      name,
      fitScore: 90 - index * 4,
      reasoning: `Seeded segment for ${name}.`,
      whiteSpace: index % 3 === 0,
    })),
    emailStyle: { tone: 'conversational', length: 'short', cta: 'book_call' },
  }

  await prisma.campaign.upsert({
    where: { id: CAMPAIGN_ID },
    update: {},
    create: campaign,
  })
}

async function seedLeads(workspaceId: string) {
  for (const [index, lead] of LEADS.entries()) {
    const id = `seed_lead_${index + 1}`
    const email = `${slugify(lead.firstName)}.${slugify(lead.lastName)}@${lead.companyDomain}`
    const data: Prisma.LeadUncheckedCreateInput = {
      id,
      workspaceId,
      campaignId: CAMPAIGN_ID,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email,
      emailVerified: lead.status !== 'BOUNCED',
      emailScore: lead.status === 'BOUNCED' ? 12 : 90 + (index % 10),
      company: lead.company,
      companyDomain: lead.companyDomain,
      title: lead.title,
      seniority: lead.seniority,
      industry: lead.industry,
      companySize: lead.companySize,
      country: lead.country,
      segment: lead.segment,
      fitScore: lead.fitScore,
      intentScore: lead.intentScore,
      techStack: lead.techStack,
      status: lead.status,
      emailStatus: lead.emailStatus,
      linkedinStatus: lead.linkedinStatus,
      linkedinUrl: `https://www.linkedin.com/in/${slugify(lead.firstName)}-${slugify(lead.lastName)}`,
      icebreaker: `Saw that ${lead.company} is growing its ${lead.industry.toLowerCase()} team.`,
      personalizedEmail: {
        subject: `Quick idea for ${lead.company}`,
        preheader: `A faster way to fill ${lead.company}'s pipeline`,
        body: `Hi ${lead.firstName},\n\nSaw that ${lead.company} is growing — curious how you're handling outbound today?`,
      },
      source: 'seed',
    }

    await prisma.lead.upsert({ where: { id }, update: {}, create: data })
  }
}

async function seedSendingDomain(workspaceId: string) {
  const domain = await prisma.sendingDomain.upsert({
    where: { domain: DOMAIN },
    update: {},
    create: {
      workspaceId,
      domain: DOMAIN,
      warmthScore: 86,
      dailyLimit: 90,
      spfVerified: true,
      dkimVerified: true,
      dmarcVerified: true,
      mxVerified: true,
      isPlatformPool: false,
      fullyWarmedAt: utcDay(14),
    },
  })

  for (const [index, mailbox] of MAILBOX_NAMES.entries()) {
    const address = `${mailbox.local}@${DOMAIN}`
    await prisma.mailbox.upsert({
      where: { address },
      update: {},
      create: {
        domainId: domain.id,
        address,
        displayName: mailbox.displayName,
        smtpHost: `smtp.${DOMAIN}`,
        smtpPort: 587,
        imapHost: `imap.${DOMAIN}`,
        imapPort: 993,
        // Placeholder values: seeded mailboxes are not real and can never send.
        usernameEncrypted: 'seed:placeholder',
        passwordEncrypted: 'seed:placeholder',
        warmthScore: 88 - index * 5,
        dailyLimit: 30,
        isWarmed: true,
      },
    })
  }
}

async function seedCampaignStats() {
  const random = mulberry32(42)

  for (let daysAgo = STAT_DAYS - 1; daysAgo >= 0; daysAgo--) {
    const date = utcDay(daysAgo)
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6
    const sent = isWeekend ? Math.round(random() * 10) : 70 + Math.round(random() * 30)
    const bounced = Math.round(sent * 0.02 * random())
    const delivered = sent - bounced
    const opened = Math.round(delivered * (0.42 + random() * 0.16))
    const clicked = Math.round(opened * (0.1 + random() * 0.08))
    const replied = Math.round(delivered * (0.03 + random() * 0.03))
    const hotReplies = Math.round(replied * (0.3 + random() * 0.2))
    const meetings = Math.round(hotReplies * (0.4 + random() * 0.3))
    const unsubscribed = Math.round(delivered * 0.005 * random())
    const spend = Number((sent * 0.015).toFixed(3))

    const stat: Prisma.CampaignStatUncheckedCreateInput = {
      campaignId: CAMPAIGN_ID,
      date,
      channel: 'EMAIL',
      sent,
      delivered,
      opened,
      clicked,
      replied,
      hotReplies,
      meetings,
      bounced,
      unsubscribed,
      spend,
      costPerLead: replied > 0 ? Number((spend / replied).toFixed(3)) : null,
    }

    await prisma.campaignStat.upsert({
      where: { campaignId_date_channel: { campaignId: CAMPAIGN_ID, date, channel: 'EMAIL' } },
      update: {},
      create: stat,
    })
  }
}

async function main() {
  const { workspace, user } = await seedWorkspaceAndUser()
  await seedCampaign(workspace.id, user.id)
  await seedLeads(workspace.id)
  await seedSendingDomain(workspace.id)
  await seedCampaignStats()

  process.stdout.write(
    `Seeded workspace "${workspace.name}" with 1 campaign, ${LEADS.length} leads, ` +
      `1 sending domain, ${MAILBOX_NAMES.length} mailboxes and ${STAT_DAYS} days of stats.\n`,
  )
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    void prisma.$disconnect()
  })
