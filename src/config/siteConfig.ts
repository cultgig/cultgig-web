import {
  CandidateBenefitItem,
  CandidatePreviewItem,
  CompanyLogoItem,
  FaqItem,
  FeatureBlockItem,
  FooterColumn,
  InteractiveJobListing,
  JobPreviewItem,
  NavLinkItem,
  ReachAgentRow,
  SeoBrowseGroup,
  TestimonialItem,
} from '../types';

export const siteConfig = {
  brandName: 'cultgig:',
  brandTitle: 'Cultgig',
  copyrightYear: 2026,
  navigation: [
    { label: 'For companies', href: '#for-companies', action: 'scroll' },
    { label: 'For job seekers', href: '#for-candidates', action: 'scroll' },
    { label: 'Blog', href: '#blog', action: 'modal-info', infoKey: 'blog' },
  ] satisfies NavLinkItem[],

  hero: {
    line1: 'Where great companies',
    line2: 'meet great people.',
    description:
      'The startup job search and AI recruiting platform. Apply directly to founders, or post jobs free and hire with AI sourcing agents.',
    floatingPills: {
      left: { label: 'Interview booked · just now', dotColor: '#2B9348' },
      rightTop: { label: 'Chime · 28 applicants', dotColor: '#2B9348' },
      rightBottom: { label: '43 replies · this morning', dotColor: '#D11F68' },
    },
    candidateCard: {
      eyebrow: 'FOR CANDIDATES',
      headingLead: 'Find your ',
      headingAccent: 'next job.',
      description:
        "Apply directly to founders and hiring managers at 27,000+ startups building what's next.",
      ctaLabel: 'Sign up to find a job',
      previewHeaderLeft: 'MATCHED TO YOU · TODAY',
      previewHeaderRight: '4 NEW',
      jobs: [
        {
          id: 'hero-job-1',
          title: 'Senior Backend Engineer',
          company: 'Chime',
          companyInitials: 'C',
          companyMarkBg: '#1D332B',
          companyMarkText: '#6CE5B1',
          location: 'NYC',
          salary: '$180k–$240k',
          badge: 'NEW',
        },
        {
          id: 'hero-job-2',
          title: 'Founding Product Designer',
          company: 'Lovable',
          companyInitials: 'L',
          companyMarkBg: '#321728',
          companyMarkText: '#F472B6',
          location: 'Remote',
          salary: '$160k–$210k',
          badge: 'NEW',
        },
      ] satisfies JobPreviewItem[],
    },
    companyCard: {
      eyebrow: 'FOR COMPANIES',
      headingLead: 'Find your ',
      headingAccent: 'next hire.',
      description:
        'Post jobs free, deploy AI sourcing agents, or hand it to an Autopilot recruiter.',
      ctaLabel: 'Start hiring',
      previewHeader: 'REACH AGENT · WORKING NOW',
      candidates: [
        {
          id: 'hero-cand-1',
          name: 'Priya Shah',
          initials: 'PS',
          avatarBg: '#FCE7F3',
          avatarText: '#B51758',
          experience: 'Ex-Stripe · 6 yrs · NY',
          status: 'REPLIED',
        },
        {
          id: 'hero-cand-2',
          name: 'Marcus Bennett',
          initials: 'MB',
          avatarBg: '#E7F3EE',
          avatarText: '#1F6F50',
          experience: 'Staff Eng · Linear · SF / DC',
          status: 'PITCHED',
        },
      ] satisfies CandidatePreviewItem[],
    },
    browsePrompt: 'Just looking?',
    browseLinkLabel: 'Browse jobs',
  },

  trustedCompanies: {
    heading: "The teams building what's next hire on Cultgig.",
    supportingPrefix: '+',
    supportingHighlight: '27,000',
    supportingSuffix: 'MORE STARTUPS HIRING ON CULTGIG TODAY',
    logos: [
      { name: 'scale', displayStyle: 'scale' },
      { name: 'Neuralink', displayStyle: 'neuralink' },
      { name: 'Cognition', displayStyle: 'cognition' },
      { name: 'Brex', displayStyle: 'brex' },
      { name: 'Lovable', displayStyle: 'lovable' },
      { name: 'chime', displayStyle: 'chime' },
      { name: 'FLOCK', displayStyle: 'flock' },
      { name: 'POSTMAN', displayStyle: 'postman' },
      { name: 'klaviyo', displayStyle: 'klaviyo' },
      { name: 'braze', displayStyle: 'braze' },
      { name: 'zipline', displayStyle: 'zipline' },
      { name: 'Applied Intuition', displayStyle: 'applied' },
      { name: 'ASTRANIS', displayStyle: 'astranis' },
    ] satisfies CompanyLogoItem[],
  },

  companySection: {
    eyebrow: 'FOR COMPANIES',
    headingLine1: 'Build the team',
    headingLine2: 'that ',
    headingAccent: "defines what's next.",
    description:
      'The team you hire is the company you become. Cultgig is where startup people come to be found, and where AI finds the ones who fit your roles.',
    primaryCta: 'Find your next hire',
    secondaryCta: 'Schedule a demo',
    features: [
      {
        number: '01',
        eyebrow: '01 · CULTGIG JOBS',
        heading: 'Post once. Reach startup talent.',
        description:
          'Post free and get in front of 10M candidates who joined Cultgig because they want startup opportunities.',
      },
      {
        number: '02',
        eyebrow: '02 · CULTGIG REACH',
        heading: 'Find the candidates other searches miss.',
        description:
          'Search 500M+ profiles, uncover adjacent experience, and run personalized outreach from your inbox.',
      },
      {
        number: '03',
        eyebrow: '03 · CULTGIG AUTOPILOT',
        heading: 'Hire faster with hands-on support.',
        description:
          'Get a dedicated recruiter who sources, pitches, and schedules qualified candidates onto your calendar.',
      },
    ] satisfies FeatureBlockItem[],
  },

  candidateSection: {
    eyebrow: 'FOR CANDIDATES',
    headingLine1: 'Find work',
    headingAccent: 'that matters.',
    description:
      "Find the next company that's going to change the world, and the role that changes yours.",
    primaryCta: 'Sign up for free',
    secondaryCta: 'Learn more',
    listings: [
      {
        id: 'job-zipline-autonomy',
        company: 'Zipline',
        companyInitials: 'Z',
        companyDescription: "Building the world's fastest, most reliable autonomous delivery network.",
        activelyHiring: true,
        roleTitle: 'Senior Software Engineer, Autonomy',
        roleCategory: 'Software Engineer',
        location: 'South San Francisco · $190k–$240k · Equity',
        locationGroup: 'San Francisco',
        compensation: '$190k–$240k · 0.08% – 0.15%',
        experienceLevel: 'Senior',
        tags: ['Robotics', 'Systems', 'Series F'],
        founderNote: 'Direct review from Autonomy Engineering Lead within 48 hours.',
      },
      {
        id: 'job-lovable-product',
        company: 'Lovable',
        companyInitials: 'L',
        companyDescription: 'AI-native full-stack software creation platform used by product builders worldwide.',
        activelyHiring: true,
        roleTitle: 'Staff Full-Stack Engineer',
        roleCategory: 'Software Engineer',
        location: 'Remote · $185k–$235k · Equity',
        locationGroup: 'Remote',
        compensation: '$185k–$235k · 0.20% – 0.45%',
        experienceLevel: 'Staff',
        tags: ['TypeScript', 'AI Agents', 'Series A'],
        founderNote: 'Work directly with the founding engineering team on core generation loops.',
      },
      {
        id: 'job-cognition-ml',
        company: 'Cognition',
        companyInitials: 'C',
        companyDescription: 'Applied AI lab building Devin and frontier software engineering agents.',
        activelyHiring: true,
        roleTitle: 'Member of Technical Staff, Inference',
        roleCategory: 'AI / ML Engineer',
        location: 'New York · $210k–$280k · Equity',
        locationGroup: 'New York',
        compensation: '$210k–$280k · Competitive equity',
        experienceLevel: 'Senior',
        tags: ['LLM Infra', 'Distributed', 'Growth'],
        founderNote: 'Interview directly with founding researchers and system architects.',
      },
      {
        id: 'job-brex-design',
        company: 'Brex',
        companyInitials: 'B',
        companyDescription: 'Modern corporate card, spend management, and treasury platform for startups.',
        activelyHiring: true,
        roleTitle: 'Lead Product Designer, Treasury',
        roleCategory: 'Product Designer',
        location: 'San Francisco · $175k–$215k · Equity',
        locationGroup: 'San Francisco',
        compensation: '$175k–$215k · Full benefits',
        experienceLevel: 'Senior',
        tags: ['Fintech', 'Design Systems', 'Series D+'],
        founderNote: 'Join the core financial workflows design team.',
      },
      {
        id: 'job-postman-pm',
        company: 'Postman',
        companyInitials: 'P',
        companyDescription: 'The API platform used by 35M+ developers to design, test, and ship APIs.',
        activelyHiring: true,
        roleTitle: 'Principal Product Manager, AI Workflows',
        roleCategory: 'Product Manager',
        location: 'San Francisco · $195k–$245k · Equity',
        locationGroup: 'San Francisco',
        compensation: '$195k–$245k · Equity package',
        experienceLevel: 'Staff',
        tags: ['Developer Tools', 'APIs', 'Enterprise'],
        founderNote: 'Partner directly with VP of Product and platform engineering.',
      },
      {
        id: 'job-chime-ny',
        company: 'Chime',
        companyInitials: 'Ch',
        companyDescription: 'Consumer financial technology platform helping everyday members unlock financial progress.',
        activelyHiring: true,
        roleTitle: 'Senior Backend Engineer, Ledger Core',
        roleCategory: 'Software Engineer',
        location: 'New York · $180k–$240k · Equity',
        locationGroup: 'New York',
        compensation: '$180k–$240k · Equity + Bonus',
        experienceLevel: 'Senior',
        tags: ['Go / Java', 'Fintech', 'High Scale'],
        founderNote: 'Hiring directly into the core payments reliability group.',
      },
    ] satisfies InteractiveJobListing[],
  },

  candidateBenefits: [
    {
      number: '01',
      heading: "Dream roles at the companies building what's next.",
      description:
        'High-growth teams in AI, infra, robotics, fintech, and frontier categories.',
    },
    {
      number: '02',
      heading: 'Companies come find you.',
      description:
        "AI sourcing surfaces you to recruiters, so the right roles reach you even when you're not looking.",
    },
    {
      number: '03',
      heading: 'Talk to the people doing the actual hiring.',
      description:
        'Direct lines to founders and hiring managers, not third-party recruiters.',
    },
    {
      number: '04',
      heading: "Show what you can do, not just where you've been.",
      description:
        "Your profile goes past the résumé: projects, work, and what you'd actually contribute.",
    },
  ] satisfies CandidateBenefitItem[],

  reachSection: {
    eyebrow: 'FEATURED · CULTGIG REACH',
    headingLine1: 'Reach the right',
    headingLine2: 'candidates.',
    headingAccent: 'Automatically.',
    description:
      "The agentic recruiting platform that does what manual screening can't: it evaluates every candidate, surfaces the ones who'd get filtered out, and runs personalized outreach until they reply. Done by AI, guided by you.",
    ctaLabel: 'Explore AI candidate sourcing',
    agentsHeading: '3 agents working',
    agentsStatus: 'LIVE',
    agents: [
      {
        id: 'agent-nyc-backend',
        name: 'NYC Senior · Backend',
        evaluated: 241,
        matched: 117,
        pitched: 12,
        replied: 3,
        recentNote: '+1 reply · 1m ago',
        topMatch: 'Priya Shah (Ex-Stripe · Distributed Systems)',
      },
      {
        id: 'agent-react-remote',
        name: 'React Focused · Remote',
        evaluated: 183,
        matched: 94,
        pitched: 8,
        replied: 2,
        recentNote: '2 outreach follow-ups sent · 4m ago',
        topMatch: 'Devon Brooks (Staff Frontend · Design Tooling)',
      },
      {
        id: 'agent-fintech',
        name: 'Fintech Experience',
        evaluated: 117,
        matched: 75,
        pitched: 6,
        replied: 1,
        recentNote: 'Evaluating 14 new profiles · live',
        topMatch: 'Ananya Rao (Core Payments · ex-Plaid)',
      },
    ] satisfies ReachAgentRow[],
  },

  testimonials: {
    eyebrow: 'HIRED ON CULTGIG',
    headingLead: 'Jobs found. ',
    headingAccent: 'Teams built.',
    items: [
      {
        id: 't1',
        roleLabel: 'CANDIDATE',
        quote:
          '"I got my tech job on Cultgig 4 years ago and I\'m still happy! Pays well, great culture, and unlimited PTO."',
        variant: 'pink',
      },
      {
        id: 't2',
        roleLabel: 'RECRUITER',
        quote:
          '"Half of the offers I give are sourced from Cultgig. It\'s the best product for anyone looking for startup talent."',
        variant: 'dark',
      },
      {
        id: 't3',
        roleLabel: 'CANDIDATE',
        quote:
          '"I love Cultgig. I got my current job entirely through the site last year. Super easy to use and I love the UI."',
        variant: 'pink',
      },
      {
        id: 't4',
        roleLabel: 'RECRUITER',
        quote:
          '"I can\'t imagine my day-to-day without this platform. Life would be a lot more difficult."',
        variant: 'dark',
      },
    ] satisfies TestimonialItem[],
  },

  faq: {
    eyebrow: 'FAQ',
    headingLead: 'Common ',
    headingAccent: 'questions.',
    items: [
      {
        id: 'faq-1',
        question: 'What is Cultgig?',
        answer:
          'Cultgig is the hiring marketplace for startups: post jobs for free with Cultgig Jobs, source with AI agents through Cultgig Reach, or get done-for-you recruiting with Cultgig Autopilot, connected to a network of 10M+ opted-in candidates.',
      },
      {
        id: 'faq-2',
        question: 'Is Cultgig free to post jobs?',
        answer:
          'Yes. Any startup or hiring team can post roles and receive inbound applications on Cultgig Jobs completely free. Paid tiers unlock Cultgig Reach AI sourcing agents and Autopilot managed recruiting.',
      },
      {
        id: 'faq-3',
        question: 'Is Cultgig free for job seekers?',
        answer:
          'Yes, Cultgig is 100% free for candidates. You can create a profile, browse transparent salary and equity ranges, and apply directly to founders and hiring managers with no fees.',
      },
      {
        id: 'faq-4',
        question: 'How many startups and candidates are on Cultgig?',
        answer:
          'Over 27,000+ startups actively hire on Cultgig, alongside a network of 10M+ startup-ready candidates and 500M+ searchable profiles across engineering, product, design, AI, and operations.',
      },
      {
        id: 'faq-5',
        question: 'Does Cultgig offer AI recruiting software?',
        answer:
          'Yes. Cultgig Reach deploys autonomous sourcing agents that calibrate on your role, evaluate hundreds of candidate profiles beyond rigid keyword filters, and run personalized outreach directly from your inbox.',
      },
      {
        id: 'faq-6',
        question: 'Who is Cultgig for?',
        answer:
          'Cultgig is built for venture-backed startups, frontier technology teams, and high-impact builders—from seed-stage founders making their first hires to growth-stage engineering and product organizations.',
      },
    ] satisfies FaqItem[],
  },

  finalCta: {
    headingLead: "What's ",
    headingAccent: 'your next move?',
    description: 'The right job, or the right hire. Both start here.',
    primaryCta: 'Sign up to find a job',
    secondaryCta: 'Start hiring',
  },

  footer: {
    description:
      'Cultgig is the AI recruiting platform and talent marketplace for startups. Post jobs, search for candidates with AI agents, or partner with a dedicated recruiter.',
    columns: [
      {
        heading: 'FOR COMPANIES',
        links: [
          { label: 'Recruiting platform', href: '#for-companies' },
          { label: 'Post jobs for free', href: '#start-hiring', infoKey: 'post-free' },
          { label: 'AI candidate sourcing', href: '#reach' },
          { label: 'Managed recruiting', href: '#autopilot', infoKey: 'autopilot' },
          { label: 'Plans and pricing', href: '#pricing', infoKey: 'pricing' },
        ],
      },
      {
        heading: 'FOR CANDIDATES',
        links: [
          { label: 'Candidate overview', href: '#for-candidates' },
          { label: 'Startup jobs', href: '#browse-jobs', infoKey: 'browse-jobs' },
          { label: 'Remote jobs', href: '#remote-jobs', infoKey: 'remote-jobs' },
          { label: 'Remote work guide', href: '#remote-guide', infoKey: 'remote-guide' },
          { label: 'Get discovered', href: '#get-discovered', infoKey: 'get-discovered' },
          { label: 'Salary calculator', href: '#salary', infoKey: 'salary' },
        ],
      },
      {
        heading: 'COMPANY',
        links: [
          { label: 'About', href: '#about', infoKey: 'about' },
          { label: 'Customer stories', href: '#testimonials' },
          { label: 'Blog', href: '#blog', infoKey: 'blog' },
          { label: 'Careers', href: '#careers', infoKey: 'careers' },
          { label: 'Contact', href: '#contact', infoKey: 'contact' },
        ],
      },
      {
        heading: 'TRUST & SUPPORT',
        links: [
          { label: 'Help centre', href: '#help', infoKey: 'help' },
          { label: 'Trust centre', href: '#trust', infoKey: 'trust' },
          { label: 'AI audit centre', href: '#ai-audit', infoKey: 'ai-audit' },
          { label: 'Platform status', href: '#status', infoKey: 'status' },
          { label: 'Privacy & cookies', href: '#privacy', infoKey: 'privacy' },
          { label: 'Terms & risks', href: '#terms', infoKey: 'terms' },
        ],
      },
    ] satisfies FooterColumn[],
    seoBrowseHeading: 'BROWSE STARTUP JOBS BY ROLE AND LOCATION',
    seoBrowseGroups: [
      {
        label: 'JOBS BY ROLE',
        links: [
          'Software Engineer Jobs',
          'Product Manager Jobs',
          'Product Designer Jobs',
          'Data Analyst Jobs',
          'UI/UX Designer Jobs',
          'Graphic Designer Jobs',
          'Operations Manager Jobs',
          'Growth Marketer Jobs',
          'More jobs by role ▾',
        ],
      },
      {
        label: 'REMOTE JOBS',
        links: [
          'Remote Software Engineer Jobs',
          'Remote Product Manager Jobs',
          'Remote Product Designer Jobs',
          'Remote Data Analyst Jobs',
          'Remote UI/UX Designer Jobs',
          'Remote Graphic Designer Jobs',
          'Remote Operations Manager Jobs',
          'Remote Growth Marketer Jobs',
          'More remote jobs ▾',
        ],
      },
      {
        label: 'JOBS BY LOCATION',
        links: [
          'Jobs in San Francisco',
          'Jobs in New York City',
          'Jobs in Los Angeles',
          'Jobs in Boston',
          'Jobs in Seattle',
          'Jobs in Austin',
          'Jobs in Chicago',
          'Jobs in Denver',
          'More locations ▾',
        ],
      },
      {
        label: 'COLLECTIONS',
        links: [
          'Junior software engineer jobs',
          'Jobs for bootcamp grads',
          'More job collections ▾',
        ],
      },
      {
        label: 'BROWSE ALL',
        links: [
          'Remote tech jobs',
          'Tech startups',
          'Startups hiring now',
          'Tech hubs',
        ],
      },
    ] satisfies SeoBrowseGroup[],
  },

  infoDrawerContent: {
    blog: {
      eyebrow: 'CULTGIG EDITORIAL',
      title: 'The Cultgig Journal',
      summary:
        'Field notes on startup hiring, founder-led recruiting, compensation benchmarks, and how AI agents are reshaping technical talent discovery.',
      highlights: [
        '2026 State of Startup Compensation: Equity & Cash Benchmarks across Seed to Series C',
        'Why Direct Founder Outreach Outperforms Traditional Applicant Tracking Queues',
        'Calibrating Agentic Sourcing: Evaluating Builders Beyond Keyword Match',
      ],
    },
    pricing: {
      eyebrow: 'PLANS & PRICING',
      title: 'Start free. Scale with AI sourcing.',
      summary:
        'Post unlimited roles on Cultgig Jobs for $0. Upgrade to Cultgig Reach for autonomous candidate sourcing or Autopilot for dedicated recruiting.',
      highlights: [
        'Cultgig Jobs — Free forever for startups posting roles and reviewing inbound applicants',
        'Cultgig Reach — Autonomous AI sourcing agents calibrated to your engineering & product bar',
        'Cultgig Autopilot — Embedded recruiter managing sourcing, outreach, and interview scheduling',
      ],
    },
    about: {
      eyebrow: 'ABOUT CULTGIG',
      title: 'Connecting the world’s builders with frontier startups.',
      summary:
        'Cultgig connects over 10M+ startup-minded candidates directly with founders and hiring managers at 27,000+ startups.',
      highlights: [
        'Direct-to-founder applications without third-party agency noise',
        'Transparent salary and equity ranges displayed upfront on every listing',
        'Agentic recruiting built to uncover high-potential builders other searches miss',
      ],
    },
    'ai-audit': {
      eyebrow: 'TRUST & GOVERNANCE',
      title: 'AI Audit Centre',
      summary:
        'Cultgig Reach evaluates skills, shipped projects, and role alignment under transparent human-in-the-loop calibration.',
      highlights: [
        'No automated rejections — human hiring teams review and approve outreach criteria',
        'Audit logs of agent evaluation rubrics and candidate matching signals',
        'GDPR, CCPA, and SOC 2 Type II aligned candidate data controls',
      ],
    },
  } as Record<string, { eyebrow: string; title: string; summary: string; highlights: string[] }>,
};
