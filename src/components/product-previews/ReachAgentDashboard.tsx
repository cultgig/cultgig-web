import { Radio } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useLandingStore } from '../../store/useLandingStore';

export function ReachAgentDashboard() {
  const { agentsHeading, agentsStatus, agents } = siteConfig.reachSection;
  const selectedAgentId = useLandingStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useLandingStore((s) => s.setSelectedAgentId);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) ?? agents[0];

  return (
    <div className="rounded-[20px] bg-[#051315] border border-white/10 p-5 sm:p-6 shadow-elevated text-white">
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
        <p className="text-[13.5px] font-semibold text-white">{agentsHeading}</p>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D11F68]/15 border border-[#D11F68]/35 text-[10px] font-semibold tracking-[0.08em] uppercase text-[#F472B6]">
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
                  ? 'bg-[#132225] border-[#D11F68]/45'
                  : 'bg-[#0D191B] border-white/10 hover:bg-[#122022] hover:border-white/20'
              }`}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">
                  {agent.name}
                </p>
                <p className="mt-0.5 text-[11px] text-white/55 tabular-nums">
                  {agent.evaluated} evaluated · {agent.matched} matched
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 tabular-nums">
                <span className="px-2.5 py-1 rounded-[6px] bg-[#D11F68]/20 border border-[#D11F68]/30 text-[11px] font-semibold text-[#F9A8D4]">
                  {agent.pitched} pitched
                </span>
                <span className="px-2.5 py-1 rounded-[6px] bg-[#1F4A37]/45 border border-[#34D399]/25 text-[11px] font-semibold text-[#6EE7B7]">
                  {agent.replied} replied
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Agent Live Activity Detail */}
      <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
        <span className="text-white/55 truncate">
          Working through the night · Top match: <span className="text-white/85">{activeAgent.topMatch}</span>
        </span>
        <span className="text-[#6EE7B7] font-medium shrink-0 tabular-nums">
          {activeAgent.recentNote}
        </span>
      </div>
    </div>
  );
}
