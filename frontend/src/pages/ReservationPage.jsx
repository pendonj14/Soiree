import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservationService } from '../services/reservationService'
import { PageTransition } from '../components/PageTransition'

const INITIAL_FORM = {
  reservationDate: '',
  reservationTime: '',
  numberOfGuests: '2',
  orderedItem: '',
}

export const ReservationPage = () => {
  const { isAuthenticated, token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Belt-and-suspenders guard — modal handles the primary flow
  if (!isAuthenticated) {
    navigate('/')
    return null
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await reservationService.create(token, {
        reservationDate: form.reservationDate,
        reservationTime: form.reservationTime,
        numberOfGuests: Number(form.numberOfGuests),
        orderedItem: form.orderedItem,
      })
      setSuccess(true)
      setForm(INITIAL_FORM)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col md:flex-row w-full gap-4 p-4 font-sans text-[#e8e6e3] min-h-screen pb-20 md:pb-4 md:h-screen">

        {/* Image & Title */}
        <div className="group relative flex items-end overflow-hidden rounded-2xl border border-white/5 bg-[#111] shadow-lg h-[35vh] md:h-auto md:w-1/2">
          <img
            src="https://framerusercontent.com/images/apLVZGAMneXESKaZkziIssg86a8.webp?scale-down-to=2048&width=2000&height=2400"
            alt="Wine glasses on a table"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
          <h1 className="relative z-10 p-8 sm:p-12 font-serif text-5xl sm:text-7xl leading-[1.1] tracking-widest text-[#e8e4dc]">
            BOOK <br /> A TABLE
          </h1>
        </div>

        {/* Form */}
        <div className="flex md:w-1/2 flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0c0c0c] p-8 sm:p-12 shadow-lg">

          <div className="mb-4 flex items-center gap-4">
            <div className="h-px w-4 bg-[#d8d3c5]/30" />
            <h2 className="font-serif text-2xl tracking-[0.2em] text-[#d8d3c5]">RESERVATION</h2>
            <div className="h-px w-4 bg-[#d8d3c5]/30" />
          </div>
          <p className="mb-8 sm:mb-12 max-w-md text-center text-sm leading-relaxed text-gray-400">
            Secure your spot at Soirée, where exceptional dining and a remarkable experience await.
          </p>

          {success ? (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                <span className="text-xl text-green-400">✓</span>
              </div>
              <div>
                <p className="font-serif text-lg tracking-widest text-[#d8d3c5]">RESERVATION CONFIRMED</p>
                <p className="mt-2 text-xs text-white/40">We look forward to welcoming you.</p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 rounded-lg border border-white/10 px-8 py-3 text-[10px] uppercase tracking-[0.2em] text-[#d8d3c5] transition-colors hover:bg-white/5"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid w-full max-w-lg grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <label className="font-serif text-[10px] uppercase tracking-widest text-[#d8d3c5]">Date</label>
                <input
                  type="date"
                  name="reservationDate"
                  value={form.reservationDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 transition-colors focus:border-white/30 focus:outline-none scheme-dark"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif text-[10px] uppercase tracking-widest text-[#d8d3c5]">Time</label>
                <input
                  type="time"
                  name="reservationTime"
                  value={form.reservationTime}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 transition-colors focus:border-white/30 focus:outline-none scheme-dark"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif text-[10px] uppercase tracking-widest text-[#d8d3c5]">Guests</label>
                <select
                  name="numberOfGuests"
                  value={form.numberOfGuests}
                  onChange={handleChange}
                  className="appearance-none rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 transition-colors focus:border-white/30 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                  <option value="9">9+ Guests</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif text-[10px] uppercase tracking-widest text-[#d8d3c5]">
                  Special Requests
                </label>
                <input
                  type="text"
                  name="orderedItem"
                  value={form.orderedItem}
                  onChange={handleChange}
                  placeholder="Allergies, occasions..."
                  className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 placeholder-gray-600 transition-colors focus:border-white/30 focus:outline-none"
                />
              </div>

              {error && (
                <div className="col-span-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="col-span-2 mt-2 rounded-lg border border-white/10 bg-[#151515] py-4 font-serif text-[10px] uppercase tracking-[0.2em] text-[#d8d3c5] transition-colors hover:bg-[#222] disabled:opacity-40"
              >
                {loading ? 'Reserving...' : 'Confirm Reservation'}
              </button>

            </form>
          )}

        </div>
      </div>
    </PageTransition>
  )
}
