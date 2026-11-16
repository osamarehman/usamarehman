export const SITE = {
  name: 'Usama Rehman',
  role: 'Systems and AI engineer',
  location: 'Hyderabad, Pakistan',
  timezone: 'UTC+5',
  email: 'osamarehmanmughal@gmail.com',
  headline: 'I build the systems a business runs on, and I stay on to run them.',
  lead: 'Custom CRMs, AI phone agents and coded automations, built for your business and run on a server you own.',
  intro: 'I build the CRM, the automations and the AI agents a business runs on, deploy them on a server the client owns, and stay on to run them. One roofing company in Maryland has kept me for three years.',
  hours: 'I work US and Australian business hours.',
  url: 'https://www.usamarehman.dev',
  links: {
    linkedin: 'https://www.linkedin.com/in/usamamughal95/',
    upwork: 'https://www.upwork.com/freelancers/usamamughal95',
    github: 'https://github.com/osamarehman',
    x: 'https://x.com/usamarehman_dev',
  },
};

export const CLIENTS = [
  { name: 'Capitol Improvements', mark: 'CI' },
  { name: 'Transformula', mark: 'TF' },
  { name: 'Chasing Better 247', mark: 'CB' },
  { name: 'Atrium Homes', mark: 'AH' },
  { name: 'LunoMotion', mark: 'LM' },
  { name: 'ClientSpring', mark: 'CS' },
  { name: 'Climartis', mark: 'CL' },
];

export const PROOF_STATS = [
  { value: '46', label: 'completed jobs on Upwork' },
  { value: '5,000+', label: 'hours on Upwork' },
  { value: '100%', label: 'Job Success' },
  { value: '4.9', label: 'from 22 reviews' },
  { value: '$200K+', label: 'earned on Upwork' },
  { value: 'Top Rated Plus', label: 'Upwork badge' },
];

export const SERVICES = [
  {
    index: '01',
    title: 'Custom CRM',
    category: 'build',
    description: 'A CRM shaped to the steps your team actually does, with your old data moved across.',
    note: '2,479 contacts and 2,704 jobs moved from LEAP with 0 errors.',
    art: 'crm',
  },
  {
    index: '02',
    title: 'AI phone agent',
    category: 'build',
    description: 'A phone agent that checks live calendars and books into your CRM.',
    note: 'Call the demo at (240) 820-3353.',
    art: 'phone',
  },
  {
    index: '03',
    title: 'Member and client portals',
    category: 'build',
    description: 'Portals that mirror your billing or membership system.',
    note: '42,000 members and 85,000 contracts mirrored from PerfectGym.',
    art: 'portal',
  },
  {
    index: '04',
    title: 'Internal tools from a spreadsheet',
    category: 'build',
    description: "Send me the tracker your business runs on. I'll send back a working demo.",
    note: 'Working demo the same day, live in four weeks.',
    art: 'sheet',
  },
  {
    index: '05',
    title: 'Replace no-code workflows',
    category: 'fix',
    description: 'n8n, Zapier or Make workflows rebuilt as coded services you own.',
    note: 'Four n8n workflows replaced. 508 daily runs with no failures.',
    art: 'workflow',
  },
  {
    index: '06',
    title: 'Migrations',
    category: 'fix',
    description: 'Data and content moved with parity proven, not assumed.',
    note: '2,382 data points checked, 0 mismatches.',
    art: 'migration',
  },
  {
    index: '07',
    title: 'Review-and-deploy pipeline',
    category: 'faster',
    description: 'Every change gated on tests, reviewed by Claude, rolled back automatically.',
    note: 'More than 300 changes gated on 4,100+ tests.',
    art: 'pipeline',
  },
  {
    index: '08',
    title: 'Your own server',
    category: 'faster',
    description: 'One server in your own cloud account, about $25 a month, with encrypted backups and a runbook.',
    note: 'Hosting providers moved in an 18-minute cutover.',
    art: 'server',
  },
  {
    index: '09',
    title: 'I stay on to run it',
    category: 'team',
    description: 'I build it, deploy it and keep running it.',
    note: 'One client kept me for three years.',
    art: 'operate',
  },
] as const;

export const PROCESS = [
  {
    index: '01',
    title: 'Send me the workflow',
    description: "Send the workflow that's costing you the most hours and the tools it touches. A spreadsheet is fine.",
  },
  {
    index: '02',
    title: 'Working demo',
    description: 'I build a working demo from your real process. For Atrium Homes that was the same day.',
  },
  {
    index: '03',
    title: 'Build on your server',
    description: "The system goes onto one server in your own cloud account, with backups and a runbook.",
  },
  {
    index: '04',
    title: 'Live, then I run it',
    description: 'For Atrium Homes the job tracker was live within four weeks. I stay on to run it.',
  },
];

export const PRODUCTS = [
  {
    index: '02',
    name: 'ShipDeck',
    status: 'Public beta',
    description: 'A persistent browser terminal on your own server for running Claude Code. Managed provisioning, domains, Stripe billing and an MCP server of 25 tools.',
    proof: '165 changes gated, reviewed, merged and deployed against 832 backend tests.',
    href: 'https://app.shipdeck.dev',
    art: 'terminal',
  },
  {
    index: '03',
    name: 'Runova',
    status: 'iOS and Android',
    description: 'Runs Claude Code agents from a phone. Rooms let agents on different machines message each other.',
    proof: 'iOS and Android from one Kotlin codebase.',
    art: 'mobile',
  },
  {
    index: '04',
    name: 'SureCaller',
    status: 'Closed testing',
    description: 'An Android caller-ID app, in closed testing on Google Play.',
    proof: 'Android caller ID.',
    art: 'caller',
  },
  {
    index: '05',
    name: 'Hisaab',
    status: 'In testing',
    description: 'An expense tracker in testing with a small group of users.',
    proof: 'Not publicly available yet.',
    art: 'expense',
  },
];

export const SKILLS = [
  { group: 'Languages', items: 'TypeScript, JavaScript, Python, SQL, Bash' },
  { group: 'Backend', items: 'FastAPI, Flask, Express, Bun, Node.js, PostgreSQL, Redis, Celery, BullMQ' },
  { group: 'Frontend', items: 'React, SolidJS, Next.js, Tailwind CSS, Strapi, Webflow' },
  { group: 'AI', items: 'Claude API, Claude Code, OpenAI, Gemini, MCP servers, tool-calling agents, VAPI voice agents' },
  { group: 'Integrations', items: 'Stripe, Twilio, Trainerize, PerfectGym, LEAP, Monday.com, HubSpot, Google Workspace' },
  { group: 'Infrastructure', items: 'Docker Compose, Linux, Caddy, Traefik, GitHub Actions, backups and restore' },
];
