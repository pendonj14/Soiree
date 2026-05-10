import { ReservationBadge } from './ReservationBadge';
import { ReservationActions } from './ReservationActions';

export function ReservationTableRow({ reservation, onAccept, onReject, onDone, onDelete }) {
  return (
    <tr className="hover:bg-[#141414] transition-colors border-b border-[#141414]">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-[#d4ccb6]">{reservation.guestName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[#888]">
          {new Date(reservation.reservationDate).toLocaleDateString(undefined, { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#888]">
        {reservation.reservationTime}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#888]">
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {reservation.numberOfGuests}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ReservationBadge status={reservation.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <ReservationActions 
          status={reservation.status}
          onAccept={() => onAccept(reservation._id)}
          onReject={() => onReject(reservation._id)}
          onDone={() => onDone(reservation._id)}
          onDelete={() => onDelete(reservation._id)}
        />
      </td>
    </tr>
  );
}
