import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useSocket } from '../../hooks/useSocket';

const FILTERS = ['pending', 'accepted', 'rejected', 'done', 'all'];

const BADGE = {
  pending:  { bg: '#2a2000', color: '#f0a500', label: 'PENDING' },
  accepted: { bg: '#1a2e1a', color: '#4caf50', label: 'ACCEPTED' },
  rejected: { bg: '#2e1a1a', color: '#f44336', label: 'REJECTED' },
  done:     { bg: '#1a1a2e', color: '#7986cb', label: 'DONE' },
};

export function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getReservations()
      .then(({ reservations }) => setReservations(reservations))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = useCallback(async (id, status) => {
    await adminService.updateStatus(id, status);
    setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
  }, []);

  const handleDelete = useCallback(async (id) => {
    await adminService.deleteReservation(id);
    setReservations((prev) => prev.filter((r) => r._id !== id));
  }, []);

  const handleDeleteAllDone = useCallback(async () => {
    if (!window.confirm('Delete all completed reservations? This cannot be undone.')) return;
    await adminService.deleteAllDone();
    setReservations((prev) => prev.filter((r) => r.status !== 'done'));
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

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>Reservations</div>
        <div style={s.subtitle}>Manage all guest reservations</div>
      </div>

      <div style={s.filterRow}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.pill, ...(filter === f ? s.pillActive : {}) }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {filter === 'done' && (
          <button onClick={handleDeleteAllDone} style={s.deleteAllBtn}>Delete All</button>
        )}
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        <table style={s.table}>
          <thead>
            <tr>
              {['GUEST', 'DATE', 'TIME', 'GUESTS', 'STATUS', 'ACTIONS'].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#444', padding: 32 }}>No reservations</td></tr>
            ) : visible.map((r) => {
              const badge = BADGE[r.status];
              return (
                <tr key={r._id}>
                  <td style={s.td}>{r.guestName}</td>
                  <td style={{ ...s.td, color: '#888' }}>{new Date(r.reservationDate).toLocaleDateString()}</td>
                  <td style={{ ...s.td, color: '#888' }}>{r.reservationTime}</td>
                  <td style={{ ...s.td, color: '#888' }}>{r.numberOfGuests}</td>
                  <td style={s.td}>
                    <span style={{ background: badge.bg, color: badge.color, fontSize: 9, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: 'right' }}>
                    <RowActions
                      status={r.status}
                      onAccept={() => handleStatus(r._id, 'accepted')}
                      onReject={() => handleStatus(r._id, 'rejected')}
                      onDone={() => handleStatus(r._id, 'done')}
                      onDelete={() => handleDelete(r._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowActions({ status, onAccept, onReject, onDone, onDelete }) {
  const Btn = ({ bg, color, onClick, children }) => (
    <button onClick={onClick} style={{ background: bg, color, fontSize: 9, padding: '3px 10px', borderRadius: 3, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
      {children}
    </button>
  );
  if (status === 'pending') return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
      <Btn bg="#1a2e1a" color="#4caf50" onClick={onAccept}>Accept</Btn>
      <Btn bg="#2e1a1a" color="#f44336" onClick={onReject}>Reject</Btn>
    </div>
  );
  if (status === 'accepted') return <Btn bg="#1a1a2e" color="#7986cb" onClick={onDone}>Mark Done</Btn>;
  if (status === 'done')     return <Btn bg="#2e1a1a" color="#f44336" onClick={onDelete}>Delete</Btn>;
  return <span style={{ color: '#333', fontSize: 10 }}>—</span>;
}

const s = {
  page:       { display: 'flex', flexDirection: 'column', height: '100%' },
  header:     { padding: '16px 20px 12px', borderBottom: '1px solid #1e1e1e' },
  title:      { color: '#d4ccb6', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 },
  subtitle:   { color: '#555', fontSize: 10, marginTop: 2 },
  filterRow:  { padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #1a1a1a', flexWrap: 'wrap' },
  pill:       { background: '#1e1e1e', color: '#666', fontSize: 9, padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer' },
  pillActive: { background: '#d4ccb6', color: '#0a0a0a', fontWeight: 600 },
  deleteAllBtn: { marginLeft: 'auto', background: '#2e1a1a', color: '#f44336', fontSize: 9, padding: '3px 12px', borderRadius: 4, border: '1px solid #f4433622', cursor: 'pointer', fontWeight: 600 },
  table:      { width: '100%', borderCollapse: 'collapse', fontSize: 10 },
  th:         { textAlign: 'left', padding: '8px 20px', color: '#555', fontWeight: 500, letterSpacing: 0.5, fontSize: 9, borderBottom: '1px solid #1e1e1e' },
  td:         { padding: '10px 20px', color: '#d4ccb6', borderBottom: '1px solid #141414' },
  center:     { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' },
};
