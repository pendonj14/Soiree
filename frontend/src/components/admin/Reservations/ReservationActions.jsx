function ActionBtn({ bg, color, hoverBg, onClick, children }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-1.5 rounded text-xs font-semibold tracking-wider transition-colors duration-200 ${bg} ${color} ${hoverBg}`}
    >
      {children}
    </button>
  );
}

export function ReservationActions({ status, onAccept, onReject, onDone, onDelete }) {
  if (status === 'pending') return (
    <div className="flex gap-2 justify-end">
      <ActionBtn bg="bg-[#1a2e1a]" color="text-[#4caf50]" hoverBg="hover:bg-[#254225]" onClick={onAccept}>Accept</ActionBtn>
      <ActionBtn bg="bg-[#2e1a1a]" color="text-[#f44336]" hoverBg="hover:bg-[#422525]" onClick={onReject}>Reject</ActionBtn>
    </div>
  );
  if (status === 'accepted') return <ActionBtn bg="bg-[#1a1a2e]" color="text-[#7986cb]" hoverBg="hover:bg-[#252542]" onClick={onDone}>Mark Done</ActionBtn>;
  if (status === 'done')     return <ActionBtn bg="bg-[#2e1a1a]" color="text-[#f44336]" hoverBg="hover:bg-[#422525]" onClick={onDelete}>Delete</ActionBtn>;
  return <span className="text-[#555] text-sm pr-4">—</span>;
}
