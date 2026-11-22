export interface NavLinkItem {
  label: string;
  href: string;
  action?: 'scroll' | 'modal-info';
  infoKey?: string;
}

export interface JobPreviewItem {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyMarkBg: string;
  companyMarkText: string;
  location: string;
  salary: string;
  badge: string;
}

export interface CandidatePreviewItem {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  experience: string;
  status: 'REPLIED' | 'PITCHED' | 'SCHEDULED';
}

export interface CompanyLogoItem {
  name: string;
  displayStyle:
    | 'scale'
    | 'neuralink'
    | 'cognition'
    | 'brex'
    | 'lovable'
    | 'chime'
    | 'flock'
    | 'postman'
    | 'klaviyo'
    | 'braze'
    | 'zipline'
    | 'applied'
    | 'astranis';
}

export interface FeatureBlockItem {
  number: string;
  eyebrow: string;
  heading: string;
  description: string;
}

export interface InteractiveJobListing {
  id: string;
  company: string;
  companyInitials: string;
  companyDescription: string;
  activelyHiring: boolean;
  roleTitle: string;
  roleCategory: 'Software Engineer' | 'Product Designer' | 'AI / ML Engineer' | 'Product Manager';
  location: string;
  locationGroup: 'San Francisco' | 'New York' | 'Remote';
  compensation: string;
  experienceLevel: 'Senior' | 'Staff' | 'Founding' | 'Mid-level';
  tags: string[];
  founderNote: string;
}

export interface CandidateBenefitItem {
  number: string;
  heading: string;
  description: string;
}

export interface ReachAgentRow {
  id: string;
  name: string;
  evaluated: number;
  matched: number;
  pitched: number;
  replied: number;
  recentNote: string;
  topMatch: string;
}

export interface TestimonialItem {
  id: string;
  roleLabel: 'CANDIDATE' | 'RECRUITER';
  quote: string;
  variant: 'pink' | 'dark';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FooterLinkItem {
  label: string;
  href: string;
  infoKey?: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLinkItem[];
}

export interface SeoBrowseGroup {
  label: string;
  links: string[];
}

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  company?: string;
  roleFocus: string;
  inquiryType: 'hire' | 'demo' | 'contact' | 'newsletter';
  notes?: string;
}

export interface ServiceResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: 'VALIDATION_ERROR' | 'UNCONFIGURED' | 'DUPLICATE' | 'REQUEST_FAILED';
}

export type ActiveModalType =
  | null
  | { type: 'auth'; mode: 'sign-up' | 'log-in'; audience: 'candidate' | 'company' }
  | { type: 'lead'; mode: 'hire' | 'demo' | 'contact' }
  | { type: 'jobs'; filterQuery?: string; selectedJobId?: string }
  | { type: 'info'; infoKey: string };
