import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useLandingStore } from '../../store/useLandingStore';
import { Button } from '../buttons/Button';

export function HeroAudienceCards() {
  const { candidateCard, companyCard } = siteConfig.hero;
  const openAuth = useLandingStore((s) => s.openAuth);
  const openLead = useLandingStore((s) => s.openLead);
  const openJobs = useLandingStore((s) => s.openJobs);

  return (
    <div className="max-w-[920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
      {/* Card A — FOR CANDIDATES */}
      <article className="relative rounded-[18px] bg-[#051315] border border-white/10 p-6 sm:p-8 text-left flex flex-col justify-between overflow-hidden shadow-card hover:-translate-y-0.5 transition-transform duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-0 w-72 h-72 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(209, 31, 104, 0.55) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10">
          <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D11F68]">
            {candidateCard.eyebrow}
          </p>
          <h2 className="mt-2 font-display font-bold text-[26px] sm:text-[28px] leading-[1.15] tracking-[-0.02em] text-white">
            {candidateCard.headingLead}
            <span className="italic text-[#D11F68]">{candidateCard.headingAccent}</span>
          </h2>
          <p className="mt-2.5 text-[13px] leading-[1.6] text-white/70 max-w-[330px]">
            {candidateCard.description}
          </p>
          <div className="mt-5">
            <Button variant="pink" size="md" onClick={() => openAuth('sign-up', 'candidate')}>
              {candidateCard.ctaLabel}
              <ArrowRight size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Compact Job Preview Panel */}
        <div className="relative z-10 mt-7 rounded-[12px] bg-[#101D1F] border border-white/10 p-3.5">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <span className="text-[9.5px] font-semibold tracking-[0.1em] uppercase text-white/50">
              {candidateCard.previewHeaderLeft}
            </span>
            <span className="text-[9.5px] font-semibold tracking-[0.06em] uppercase text-[#F472B6] tabular-nums">
              {candidateCard.previewHeaderRight}
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {candidateCard.jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => openJobs(job.company)}
                className="w-full pt-2.5 pb-2 first:pt-2.5 last:pb-0.5 flex items-center justify-between gap-3 text-left group hover:opacity-95 transition-opacity"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ backgroundColor: job.companyMarkBg, color: job.companyMarkText }}
                    aria-hidden="true"
                  >
                    {job.companyInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-white truncate group-hover:text-[#F472B6] transition-colors">
                      {job.title}
                    </p>
                    <p className="text-[10.5px] text-white/55 truncate tabular-nums">
                      {job.company} · {job.location} · {job.salary}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-[5px] bg-[#D11F68]/20 border border-[#D11F68]/30 text-[9.5px] font-semibold tracking-[0.06em] text-[#F9A8D4] shrink-0">
                  {job.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </article>

      {/* Card B — FOR COMPANIES */}
      <article className="rounded-[18px] bg-[#FDF1F8] border border-[#F4DCEB] p-6 sm:p-8 text-left flex flex-col justify-between shadow-card hover:-translate-y-0.5 transition-transform duration-200">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D11F68]">
            {companyCard.eyebrow}
          </p>
          <h2 className="mt-2 font-display font-bold text-[26px] sm:text-[28px] leading-[1.15] tracking-[-0.02em] text-[#051315]">
            {companyCard.headingLead}
            <span className="italic text-[#D11F68]">{companyCard.headingAccent}</span>
          </h2>
          <p className="mt-2.5 text-[13px] leading-[1.6] text-[#646A6B] max-w-[330px]">
            {companyCard.description}
          </p>
          <div className="mt-5">
            <Button variant="pink" size="md" onClick={() => openLead('hire')}>
              {companyCard.ctaLabel}
              <ArrowRight size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Compact Recruiter Activity Preview Panel */}
        <div className="mt-7 rounded-[12px] bg-white border border-[#EDEDED] p-3.5 shadow-[0_2px_10px_rgba(5,19,21,0.03)]">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F1F1F1]">
            <span className="text-[9.5px] font-semibold tracking-[0.1em] uppercase text-[#646A6B]">
              {companyCard.previewHeader}
            </span>
          </div>

          <div className="divide-y divide-[#F3F3F3]">
            {companyCard.candidates.map((cand) => (
              <div
                key={cand.id}
                className="pt-2.5 pb-2 first:pt-2.5 last:pb-0.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0"
                    style={{ backgroundColor: cand.avatarBg, color: cand.avatarText }}
                    aria-hidden="true"
                  >
                    {cand.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#051315] truncate">
                      {cand.name}
                    </p>
                    <p className="text-[10.5px] text-[#646A6B] truncate tabular-nums">
                      {cand.experience}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-[5px] text-[9.5px] font-semibold tracking-[0.06em] shrink-0 ${
                    cand.status === 'REPLIED'
                      ? 'bg-[#EEF7F2] text-[#226F49] border border-[#D4ECDF]'
                      : 'bg-[#FDF1F8] text-[#D11F68] border border-[#F3D5E7]'
                  }`}
                >
                  {cand.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
