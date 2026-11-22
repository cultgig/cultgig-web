import { Bookmark, CheckCircle2, MapPin, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { useModalBehavior } from '../../hooks/useModal';
import { logInWithAppwrite, signUpWithAppwrite } from '../../services/appwriteService';
import { submitLead } from '../../services/leadService';
import { useLandingStore } from '../../store/useLandingStore';
import { Button } from '../buttons/Button';

export function ActionModal() {
  const modal = useLandingStore((s) => s.activeModal);
  const onClose = useLandingStore((s) => s.closeModal);
  const onSwitchModal = useLandingStore((s) => s.setModal);
  const savedJobIds = useLandingStore((s) => s.savedJobIds);
  const toggleSavedJob = useLandingStore((s) => s.toggleSavedJob);
  const appliedJobIds = useLandingStore((s) => s.appliedJobIds);
  const markAppliedJob = useLandingStore((s) => s.markAppliedJob);

  useModalBehavior(Boolean(modal), onClose);

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authAudience, setAuthAudience] = useState<'candidate' | 'company'>('candidate');
  const [authMode, setAuthMode] = useState<'sign-up' | 'log-in'>('sign-up');
  const [authStatus, setAuthStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: string | null;
  }>({ loading: false, error: null, success: null });

  // Lead / Demo form state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadRole, setLeadRole] = useState('Senior Software Engineer');
  const [leadNotes, setLeadNotes] = useState('');
  const [leadStatus, setLeadStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: string | null;
  }>({ loading: false, error: null, success: null });

  // Browse jobs modal filter state
  const [jobQuery, setJobQuery] = useState('');

  useEffect(() => {
    if (!modal) return;
    setAuthStatus({ loading: false, error: null, success: null });
    setLeadStatus({ loading: false, error: null, success: null });
    if (modal.type === 'auth') {
      setAuthMode(modal.mode);
      setAuthAudience(modal.audience);
    }
    if (modal.type === 'jobs') {
      setJobQuery(modal.filterQuery || '');
    }
  }, [modal]);

  const filteredJobs = useMemo(() => {
    const q = jobQuery.trim().toLowerCase();
    return siteConfig.candidateSection.listings.filter((job) => {
      if (!q) return true;
      return `${job.company} ${job.roleTitle} ${job.location} ${job.tags.join(' ')}`
        .toLowerCase()
        .includes(q);
    });
  }, [jobQuery]);

  if (!modal) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authStatus.loading) return;
    setAuthStatus({ loading: true, error: null, success: null });

    const result =
      authMode === 'sign-up'
        ? await signUpWithAppwrite({
            email: authEmail,
            password: authPassword,
            fullName: authName,
            audience: authAudience,
          })
        : await logInWithAppwrite({
            email: authEmail,
            password: authPassword,
            audience: authAudience,
          });

    if (result.ok) {
      setAuthStatus({
        loading: false,
        error: null,
        success:
          authMode === 'sign-up'
            ? `Account created for ${result.data?.email}.`
            : `Signed in as ${result.data?.email}.`,
      });
    } else {
      setAuthStatus({
        loading: false,
        error: result.error || 'Authentication failed.',
        success: null,
      });
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadStatus.loading || modal.type !== 'lead') return;
    setLeadStatus({ loading: true, error: null, success: null });

    const result = await submitLead({
      name: leadName,
      email: leadEmail,
      company: leadCompany,
      roleFocus: leadRole,
      inquiryType: modal.mode,
      notes: leadNotes,
    });

    if (result.ok) {
      setLeadStatus({
        loading: false,
        error: null,
        success: 'Request received. Our team will follow up with you shortly.',
      });
    } else {
      setLeadStatus({
        loading: false,
        error: result.error || 'Unable to submit request.',
        success: null,
      });
    }
  };

  const infoEntry =
    modal.type === 'info'
      ? siteConfig.infoDrawerContent[modal.infoKey] || {
          eyebrow: 'CULTGIG PLATFORM',
          title: modal.infoKey
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          summary:
            'Explore how Cultgig helps startups and candidates connect directly with transparent compensation, AI sourcing agents, and hands-on recruiting.',
          highlights: [
            '27,000+ startups hiring directly on Cultgig',
            '10M+ opted-in startup candidates across engineering, product, and design',
            'SOC 2 aligned privacy and human-calibrated AI sourcing controls',
          ],
        }
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051315]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Cultgig action dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white border border-[#EDEDED] p-6 sm:p-8 shadow-elevated">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full border border-[#EDEDED] flex items-center justify-center text-[#646A6B] hover:text-[#051315] hover:bg-[#FAFAFA] transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* AUTH MODAL */}
        {modal.type === 'auth' && (
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D11F68]">
              {authMode === 'sign-up' ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}
            </p>
            <h2 className="mt-1.5 font-display font-bold text-[26px] leading-[1.15] text-[#051315]">
              {authMode === 'sign-up' ? 'Join Cultgig' : 'Log in to Cultgig'}
            </h2>

            {/* Audience Toggle */}
            <div className="mt-5 inline-flex p-1 rounded-full bg-[#FAFAFA] border border-[#EDEDED]">
              {(['candidate', 'company'] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setAuthAudience(aud)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                    authAudience === aud
                      ? 'bg-[#051315] text-white'
                      : 'text-[#646A6B] hover:text-[#051315]'
                  }`}
                >
                  {aud === 'candidate' ? 'Job Seeker' : 'Hiring Team'}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4" noValidate>
              {authMode === 'sign-up' && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="block text-[12px] font-semibold text-[#051315] mb-1.5"
                  >
                    Full name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Priya Shah"
                    required
                    className="w-full h-11 px-3.5 rounded-[10px] border border-[#DEDEDE] text-[13.5px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-[12px] font-semibold text-[#051315] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@startup.com"
                  required
                  className="w-full h-11 px-3.5 rounded-[10px] border border-[#DEDEDE] text-[13.5px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-[12px] font-semibold text-[#051315] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full h-11 px-3.5 rounded-[10px] border border-[#DEDEDE] text-[13.5px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                />
              </div>

              {authStatus.error && (
                <p
                  role="alert"
                  className="rounded-[10px] bg-[#FDF1F8] border border-[#F3D5E7] px-3.5 py-2.5 text-[12px] text-[#981249]"
                >
                  {authStatus.error}
                </p>
              )}

              {authStatus.success && (
                <p
                  role="status"
                  className="rounded-[10px] bg-[#EEF7F2] border border-[#D4ECDF] px-3.5 py-2.5 text-[12px] text-[#226F49] flex items-center gap-2"
                >
                  <CheckCircle2 size={15} aria-hidden="true" />
                  {authStatus.success}
                </p>
              )}

              <Button type="submit" variant="pink" size="lg" className="w-full" disabled={authStatus.loading}>
                {authStatus.loading
                  ? 'Please wait...'
                  : authMode === 'sign-up'
                    ? 'Create account'
                    : 'Log in'}
              </Button>
            </form>

            <p className="mt-4 text-center text-[12px] text-[#646A6B]">
              {authMode === 'sign-up' ? 'Already have an account?' : 'New to Cultgig?'}{' '}
              <button
                type="button"
                onClick={() =>
                  setAuthMode((prev) => (prev === 'sign-up' ? 'log-in' : 'sign-up'))
                }
                className="font-semibold text-[#D11F68] hover:underline"
              >
                {authMode === 'sign-up' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        )}

        {/* LEAD / START HIRING / DEMO MODAL */}
        {modal.type === 'lead' && (
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D11F68]">
              {modal.mode === 'demo'
                ? 'CULTGIG REACH & AUTOPILOT'
                : modal.mode === 'contact'
                  ? 'CONTACT CULTGIG'
                  : 'FOR HIRING TEAMS'}
            </p>
            <h2 className="mt-1.5 font-display font-bold text-[26px] leading-[1.15] text-[#051315]">
              {modal.mode === 'demo'
                ? 'Schedule a recruiting demo'
                : modal.mode === 'contact'
                  ? 'Get in touch with our team'
                  : 'Start hiring on Cultgig'}
            </h2>
            <p className="mt-2 text-[13px] text-[#646A6B]">
              Tell us about your team and the roles you are hiring for.
            </p>

            <form onSubmit={handleLeadSubmit} className="mt-5 space-y-3.5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-[12px] font-semibold text-[#051315] mb-1"
                  >
                    Your name
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                    className="w-full h-10 px-3 rounded-[10px] border border-[#DEDEDE] text-[13px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-[12px] font-semibold text-[#051315] mb-1"
                  >
                    Work email
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="alex@company.com"
                    required
                    className="w-full h-10 px-3 rounded-[10px] border border-[#DEDEDE] text-[13px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="lead-company"
                    className="block text-[12px] font-semibold text-[#051315] mb-1"
                  >
                    Company name
                  </label>
                  <input
                    id="lead-company"
                    type="text"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    placeholder="Acme Robotics"
                    className="w-full h-10 px-3 rounded-[10px] border border-[#DEDEDE] text-[13px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-role"
                    className="block text-[12px] font-semibold text-[#051315] mb-1"
                  >
                    Primary hiring focus
                  </label>
                  <input
                    id="lead-role"
                    type="text"
                    value={leadRole}
                    onChange={(e) => setLeadRole(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-[10px] border border-[#DEDEDE] text-[13px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-notes"
                  className="block text-[12px] font-semibold text-[#051315] mb-1"
                >
                  Hiring timeline or notes (optional)
                </label>
                <textarea
                  id="lead-notes"
                  rows={2}
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Looking to hire 2 senior backend engineers in NYC or remote..."
                  className="w-full p-3 rounded-[10px] border border-[#DEDEDE] text-[13px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
                />
              </div>

              {leadStatus.error && (
                <p
                  role="alert"
                  className="rounded-[10px] bg-[#FDF1F8] border border-[#F3D5E7] px-3.5 py-2.5 text-[12px] text-[#981249]"
                >
                  {leadStatus.error}
                </p>
              )}

              {leadStatus.success && (
                <p
                  role="status"
                  className="rounded-[10px] bg-[#EEF7F2] border border-[#D4ECDF] px-3.5 py-2.5 text-[12px] text-[#226F49] flex items-center gap-2"
                >
                  <CheckCircle2 size={15} aria-hidden="true" />
                  {leadStatus.success}
                </p>
              )}

              <Button type="submit" variant="pink" size="lg" className="w-full" disabled={leadStatus.loading}>
                {leadStatus.loading ? 'Submitting...' : 'Submit request'}
              </Button>
            </form>
          </div>
        )}

        {/* BROWSE JOBS / JOB DETAIL MODAL */}
        {modal.type === 'jobs' && (
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D11F68]">
              STARTUP JOB DIRECTORY
            </p>
            <h2 className="mt-1.5 font-display font-bold text-[24px] leading-[1.15] text-[#051315]">
              Explore open startup roles
            </h2>

            <div className="mt-4 relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#646A6B]"
                aria-hidden="true"
              />
              <input
                type="text"
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
                placeholder="Filter by company, role, or location..."
                aria-label="Filter startup roles"
                className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-[#FAFAFA] border border-[#EDEDED] text-[13px] text-[#051315] focus:outline-none focus:border-[#D11F68]"
              />
            </div>

            <div className="mt-4 space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="rounded-[12px] bg-[#FAFAFA] border border-[#EDEDED] p-6 text-center">
                  <p className="text-[13px] text-[#646A6B]">
                    No featured roles matched &ldquo;{jobQuery}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => setJobQuery('')}
                    className="mt-2 text-[12px] font-semibold text-[#D11F68] hover:underline"
                  >
                    Show all featured roles
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const applied = Boolean(appliedJobIds[job.id]);
                  const isSaved = Boolean(savedJobIds[job.id]);
                  return (
                    <div
                      key={job.id}
                      className="rounded-[14px] border border-[#EDEDED] p-4 hover:border-[#D5D5D5] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D11F68]">
                            {job.company} · Actively hiring
                          </p>
                          <h3 className="mt-0.5 font-display font-bold text-[16px] text-[#051315]">
                            {job.roleTitle}
                          </h3>
                          <p className="mt-1 text-[12px] text-[#646A6B] flex items-center gap-1.5 tabular-nums">
                            <MapPin size={12} aria-hidden="true" />
                            {job.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleSavedJob(job.id)}
                            aria-label={isSaved ? 'Unsave role' : 'Save role'}
                            aria-pressed={isSaved}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                              isSaved
                                ? 'border-[#D11F68] bg-[#FDF1F8] text-[#D11F68]'
                                : 'border-[#EDEDED] bg-white text-[#646A6B] hover:text-[#051315]'
                            }`}
                          >
                            <Bookmark
                              size={13}
                              className={isSaved ? 'fill-[#D11F68]' : ''}
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => markAppliedJob(job.id)}
                            className={`h-8 px-3.5 rounded-full text-[11.5px] font-semibold transition-colors ${
                              applied
                                ? 'bg-[#EEF7F2] text-[#226F49] border border-[#D4ECDF]'
                                : 'bg-[#051315] text-white hover:bg-[#1B1818]'
                            }`}
                          >
                            {applied ? 'Saved to apply' : 'Quick apply'}
                          </button>
                        </div>
                      </div>
                      <p className="mt-2.5 text-[12px] text-[#646A6B] leading-[1.5]">
                        {job.founderNote}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[#EDEDED] flex items-center justify-between gap-3">
              <span className="text-[12px] text-[#646A6B]">
                Want access to 27,000+ startups?
              </span>
              <Button
                variant="pink"
                size="sm"
                onClick={() =>
                  onSwitchModal({ type: 'auth', mode: 'sign-up', audience: 'candidate' })
                }
              >
                Create free profile
              </Button>
            </div>
          </div>
        )}

        {/* INFO DRAWER / MODAL */}
        {modal.type === 'info' && infoEntry && (
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D11F68]">
              {infoEntry.eyebrow}
            </p>
            <h2 className="mt-1.5 font-display font-bold text-[24px] leading-[1.15] text-[#051315]">
              {infoEntry.title}
            </h2>
            <p className="mt-3 text-[13.5px] leading-[1.65] text-[#646A6B]">
              {infoEntry.summary}
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-[#EDEDED] pt-4">
              {infoEntry.highlights.map((item) => (
                <li
                  key={item}
                  className="text-[12.5px] leading-[1.55] text-[#051315] flex items-start gap-2.5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#D11F68] mt-2 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="pink"
                size="md"
                onClick={() =>
                  onSwitchModal({ type: 'auth', mode: 'sign-up', audience: 'candidate' })
                }
              >
                Get started on Cultgig
              </Button>
              <Button
                variant="outline-light"
                size="md"
                onClick={() => onSwitchModal({ type: 'lead', mode: 'demo' })}
              >
                Request a demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
