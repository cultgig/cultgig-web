import { create } from 'zustand';
import { siteConfig } from '../config/siteConfig';
import { ActiveModalType } from '../types';

interface JobFiltersState {
  role: string;
  location: string;
  experience: string;
  query: string;
}

interface LandingStoreState {
  activeModal: ActiveModalType;
  mobileMenuOpen: boolean;
  savedJobIds: Record<string, boolean>;
  appliedJobIds: Record<string, boolean>;
  jobFilters: JobFiltersState;
  selectedAgentId: string;
  openFaqId: string | null;

  openAuth: (mode: 'sign-up' | 'log-in', audience?: 'candidate' | 'company') => void;
  openLead: (mode: 'hire' | 'demo' | 'contact') => void;
  openJobs: (filterQuery?: string, selectedJobId?: string) => void;
  openInfo: (infoKey: string) => void;
  setModal: (modal: ActiveModalType) => void;
  closeModal: () => void;

  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  toggleSavedJob: (jobId: string) => void;
  markAppliedJob: (jobId: string) => void;

  setJobFilter: <K extends keyof JobFiltersState>(key: K, value: JobFiltersState[K]) => void;
  resetJobFilters: () => void;

  setSelectedAgentId: (agentId: string) => void;
  toggleFaqId: (faqId: string) => void;
}

const DEFAULT_FILTERS: JobFiltersState = {
  role: 'All',
  location: 'All',
  experience: 'All',
  query: '',
};

export const useLandingStore = create<LandingStoreState>((set) => ({
  activeModal: null,
  mobileMenuOpen: false,
  savedJobIds: {},
  appliedJobIds: {},
  jobFilters: DEFAULT_FILTERS,
  selectedAgentId: siteConfig.reachSection.agents[0]?.id ?? '',
  openFaqId: siteConfig.faq.items[0]?.id ?? null,

  openAuth: (mode, audience = 'candidate') =>
    set({
      mobileMenuOpen: false,
      activeModal: { type: 'auth', mode, audience },
    }),

  openLead: (mode) =>
    set({
      mobileMenuOpen: false,
      activeModal: { type: 'lead', mode },
    }),

  openJobs: (filterQuery, selectedJobId) =>
    set({
      mobileMenuOpen: false,
      activeModal: { type: 'jobs', filterQuery, selectedJobId },
    }),

  openInfo: (infoKey) =>
    set({
      mobileMenuOpen: false,
      activeModal: { type: 'info', infoKey },
    }),

  setModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),

  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  toggleSavedJob: (jobId) =>
    set((state) => ({
      savedJobIds: {
        ...state.savedJobIds,
        [jobId]: !state.savedJobIds[jobId],
      },
    })),

  markAppliedJob: (jobId) =>
    set((state) => ({
      appliedJobIds: {
        ...state.appliedJobIds,
        [jobId]: true,
      },
    })),

  setJobFilter: (key, value) =>
    set((state) => ({
      jobFilters: {
        ...state.jobFilters,
        [key]: value,
      },
    })),

  resetJobFilters: () => set({ jobFilters: DEFAULT_FILTERS }),

  setSelectedAgentId: (selectedAgentId) => set({ selectedAgentId }),

  toggleFaqId: (faqId) =>
    set((state) => ({
      openFaqId: state.openFaqId === faqId ? null : faqId,
    })),
}));
