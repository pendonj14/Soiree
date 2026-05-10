export const BADGE = {
  pending:  { bg: 'bg-[#2a2000]', color: 'text-[#f0a500]', label: 'PENDING' },
  accepted: { bg: 'bg-[#1a2e1a]', color: 'text-[#4caf50]', label: 'ACCEPTED' },
  rejected: { bg: 'bg-[#2e1a1a]', color: 'text-[#f44336]', label: 'REJECTED' },
  done:     { bg: 'bg-[#1a1a2e]', color: 'text-[#7986cb]', label: 'DONE' },
};

export function ReservationBadge({ status }) {
  const badge = BADGE[status];
  if (!badge) return <span className="text-[#555] text-sm">—</span>;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${badge.bg} ${badge.color}`}>
      {badge.label}
    </span>
  );
}
