import { Bookmark, Search } from 'lucide-react';
import { useMemo } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { useLandingStore } from '../../store/useLandingStore';

export function CandidateSearchPreview() {
  const jobFilters = useLandingStore((s) => s.jobFilters);
  const setJobFilter = useLandingStore((s) => s.setJobFilter);
  const resetJobFilters = useLandingStore((s) => s.resetJobFilters);
  const savedJobIds = useLandingStore((s) => s.savedJobIds);
  const toggleSavedJob = useLandingStore((s) => s.toggleSavedJob);
  const openJobs = useLandingStore((s) => s.openJobs);

  const filteredListings = useMemo(() => {
    return siteConfig.candidateSection.listings.filter((item) => {
      if (jobFilters.role !== 'All' && item.roleCategory !== jobFilters.role) return false;
      if (jobFilters.location !== 'All' && item.locationGroup !== jobFilters.location) return false;
      if (jobFilters.experience !== 'All' && item.experienceLevel !== jobFilters.experience) return false;
      if (jobFilters.query.trim()) {
        const q = jobFilters.query.trim().toLowerCase();
        const hay = `${item.company} ${item.roleTitle} ${item.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [jobFilters]);

  const displayedListings = filteredListings.slice(0, 2);

  return (
    <div className="rounded-[20px] bg-[#FDF1F8] border border-[#F4DCEB] p-3.5 sm:p-5 shadow-card">
      <div className="rounded-[14px] bg-white border border-[#EDEDED] p-3.5 sm:p-4">
        {/* Filter & Search Bar */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-[10px] bg-[#FAFAFA] border border-[#EDEDED] p-2 flex flex-wrap items-center gap-1.5"
          aria-label="Job search preview filters"
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
            <Search size={13} className="text-[#646A6B] shrink-0 ml-1" aria-hidden="true" />
            <input
              type="text"
              value={jobFilters.query}
              onChange={(e) => setJobFilter('query', e.target.value)}
              placeholder="Search role or startup"
              aria-label="Search role or startup"
              className="w-full bg-transparent text-[11.5px] text-[#051315] placeholder:text-[#646A6B] focus:outline-none"
            />
          </div>

          <select
            aria-label="Role selector"
            value={jobFilters.role}
            onChange={(e) => setJobFilter('role', e.target.value)}
            className="h-7 px-2 rounded-[6px] bg-white border border-[#E5E5E5] text-[11px] font-medium text-[#051315] focus:outline-none focus:border-[#D11F68]"
          >
            <option value="All">All roles</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Product Designer">Product Designer</option>
            <option value="AI / ML Engineer">AI / ML Engineer</option>
            <option value="Product Manager">Product Manager</option>
          </select>

          <select
            aria-label="Location filter"
            value={jobFilters.location}
            onChange={(e) => setJobFilter('location', e.target.value)}
            className="h-7 px-2 rounded-[6px] bg-white border border-[#E5E5E5] text-[11px] font-medium text-[#051315] focus:outline-none focus:border-[#D11F68]"
          >
            <option value="All">All locations</option>
            <option value="San Francisco">San Francisco</option>
            <option value="New York">New York</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            aria-label="Experience filter"
            value={jobFilters.experience}
            onChange={(e) => setJobFilter('experience', e.target.value)}
            className="h-7 px-2 rounded-[6px] bg-white border border-[#E5E5E5] text-[11px] font-medium text-[#051315] focus:outline-none focus:border-[#D11F68]"
          >
            <option value="All">Any level</option>
            <option value="Senior">Senior</option>
            <option value="Staff">Staff</option>
          </select>

          <button
            type="submit"
            className="h-7 px-3 rounded-[6px] bg-[#051315] text-white text-[11px] font-semibold hover:bg-[#1B1818] transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Matches Header */}
        <div className="mt-4 mb-3 flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold text-[#051315]">
            Matches for you{' '}
            <span className="text-[11px] font-normal text-[#646A6B] tabular-nums">
              ({filteredListings.length})
            </span>
          </p>
          <span className="text-[9.5px] font-semibold tracking-[0.06em] uppercase text-[#226F49] tabular-nums">
            4 RECRUITERS ACTIVE NOW
          </span>
        </div>

        {/* Company & Job Cards */}
        {displayedListings.length === 0 ? (
          <div className="rounded-[10px] border border-[#EDEDED] bg-[#FAFAFA] p-5 text-center">
            <p className="text-[12.5px] font-medium text-[#051315]">
              No roles match these exact filters.
            </p>
            <button
              type="button"
              onClick={resetJobFilters}
              className="mt-2 text-[11.5px] font-semibold text-[#D11F68] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedListings.map((job) => {
              const isSaved = Boolean(savedJobIds[job.id]);
              return (
                <div
                  key={job.id}
                  className="rounded-[12px] border border-[#EDEDED] bg-white p-3.5 transition-colors hover:border-[#D9D9D9]"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="w-8 h-8 rounded-[8px] bg-[#051315] text-white font-display font-bold text-[12px] flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      {job.companyInitials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-semibold text-[#051315]">
                          {job.company}
                        </span>
                        {job.activelyHiring && (
                          <span className="text-[10px] font-medium text-[#226F49]">
                            · Actively hiring
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#646A6B] line-clamp-1 mt-0.5">
                        {job.companyDescription}
                      </p>
                    </div>
                  </div>

                  {/* Metadata tags */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-[5px] bg-[#FAFAFA] border border-[#EDEDED] text-[10px] font-medium text-[#646A6B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Role & actions */}
                  <div className="mt-3 pt-2.5 border-t border-[#F2F2F2] flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#051315] truncate">
                        {job.roleTitle}
                      </p>
                      <p className="text-[10.5px] text-[#646A6B] truncate tabular-nums">
                        {job.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleSavedJob(job.id)}
                        aria-pressed={isSaved}
                        className={`h-7 px-2.5 rounded-[6px] border text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                          isSaved
                            ? 'border-[#D11F68] bg-[#FDF1F8] text-[#D11F68]'
                            : 'border-[#E5E5E5] bg-white text-[#051315] hover:bg-[#FAFAFA]'
                        }`}
                      >
                        <Bookmark
                          size={11}
                          className={isSaved ? 'fill-[#D11F68]' : ''}
                          aria-hidden="true"
                        />
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openJobs(job.company, job.id)}
                        className="h-7 px-3 rounded-[6px] bg-[#051315] text-white text-[11px] font-semibold hover:bg-[#1B1818] transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
