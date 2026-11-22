import { Radio } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useLandingStore } from '../../store/useLandingStore';

export function ReachAgentDashboard() {
  const { agentsHeading, agentsStatus, agents } = siteConfig.reachSection;
  const selectedAgentId = useLandingStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useLandingStore((s) => s.setSelectedAgentId);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) ?? agents[0];

  return (
    <div className="rounded-[20px] bg-obsidian border border-white/10 p-5 sm:p-6 shadow-elevated text-ink-inverse">
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
        <p className="text-[13.5px] font-semibold text-ink-inverse">{agentsHeading}</p>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-light/15 border border-brand-light/35 text-[10px] font-semibold tracking-[0.08em] uppercase text-brand-light">
          <Radio size={11} aria-hidden="true" />
          {agentsStatus}
        </span>
      </div>

      {/* Three Agent Activity Rows */}
      <div className="mt-4 space-y-2.5" role="listbox" aria-label="Active AI sourcing agents">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <button
              key={agent.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`w-full text-left rounded-[12px] p-3.5 sm:p-4 border transition-colors duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-white/[0.08] border-brand-light/55'
                  : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-ink-inverse truncate">
                  {agent.name}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-inverse/70 tabular-nums">
                  {agent.evaluated} evaluated · {agent.matched} matched
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 tabular-nums">
                <span className="px-2.5 py-1 rounded-[6px] bg-brand-light/15 border border-brand-light/35 text-[11px] font-semibold text-brand-light">
                  {agent.pitched} pitched
                </span>
                <span className="px-2.5 py-1 rounded-[6px] bg-semantic-success/40 border border-[color:var(--color-success-border)]/35 text-[11px] font-semibold text-semantic-success-bg">
                  {agent.replied} replied
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Agent Live Activity Detail */}
      <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
        <span className="text-ink-inverse/65 truncate">
          Working through the night · Top match: <span className="text-ink-inverse/90">{activeAgent.topMatch}</span>
        </span>
        <span className="text-semantic-success-bg font-medium shrink-0 tabular-nums">
          {activeAgent.recentNote}
        </span>
      </div>
    </div>
  );
}
