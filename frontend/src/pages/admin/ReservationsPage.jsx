import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useSocket } from '../../hooks/useSocket';
import { ReservationFilters } from '../../components/admin/Reservations/ReservationFilters';
import { ReservationTableRow } from '../../components/admin/Reservations/ReservationTableRow';

export function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getReservations()
      .then(({ reservations }) => setReservations(reservations))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = useCallback(async (id, status) => {
    setError(null);
    try {
      await adminService.updateStatus(id, status);
      setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    setError(null);
    try {
      await adminService.deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleDeleteAllDone = useCallback(async () => {
    if (!window.confirm('Delete all completed reservations? This cannot be undone.')) return;
    setError(null);
    try {
      await adminService.deleteAllDone();
      setReservations((prev) => prev.filter((r) => r.status !== 'done'));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useSocket({
    'reservation:new': (r) => setReservations((prev) => [r, ...prev]),
    'reservation:status_changed': ({ reservationId, status }) =>
      setReservations((prev) => prev.map((r) => r._id === reservationId ? { ...r, status } : r)),
    'reservation:deleted': ({ reservationId }) =>
      setReservations((prev) => prev.filter((r) => r._id !== reservationId)),
    'reservation:deleted_all_done': () =>
      setReservations((prev) => prev.filter((r) => r.status !== 'done')),
  });

  const visible = filter === 'all'
    ? reservations
    : reservations.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#d4ccb6] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#888] tracking-widest text-sm uppercase">Loading Reservations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#d4ccb6] overflow-hidden">
      {/* Header section */}
      <div className="flex flex-col px-8 py-8 border-b border-[#1e1e1e] bg-[#0a0a0a] shrink-0 relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4ccb6] opacity-[0.02] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-[#d4ccb6] mb-2 font-serif">
          Reservations
        </h1>
        <p className="text-[#888] text-sm tracking-wide">
          Manage all guest reservations and tables
        </p>
      </div>

      {error && (
        <div className="px-8 py-4 bg-[#2e1a1a] text-[#f44336] text-sm font-medium border-b border-[#f44336]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
          <button onClick={() => setError(null)} className="opacity-70 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      <ReservationFilters 
        filter={filter} 
        setFilter={setFilter} 
        onDeleteAllDone={handleDeleteAllDone} 
      />

      {/* Main content table area */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#141414] border-b border-[#1e1e1e]">
                  {['GUEST', 'DATE', 'TIME', 'GUESTS', 'STATUS', 'ACTIONS'].map((h, i) => (
                    <th 
                      key={h} 
                      className={`px-6 py-5 text-xs font-semibold text-[#888] tracking-widest uppercase ${i === 5 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]/50">
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-[#444]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <p className="text-lg font-light tracking-wide text-[#888]">No reservations found</p>
                        <p className="text-sm mt-1">There are no {filter !== 'all' ? filter : ''} reservations at the moment.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visible.map((r) => (
                    <ReservationTableRow 
                      key={r._id} 
                      reservation={r}
                      onAccept={(id) => handleStatus(id, 'accepted')}
                      onReject={(id) => handleStatus(id, 'rejected')}
                      onDone={(id) => handleStatus(id, 'done')}
                      onDelete={(id) => handleDelete(id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
