import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
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
        <div className="flex w-full md:w-1/2 flex-col items-center justify-center rounded-3xl border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md p-10 sm:p-16 lg:p-20 shadow-2xl relative overflow-hidden">

          <div className="mb-6 flex items-center gap-6">
            <div className="h-[1px] w-8 bg-[#d8d3c5]/30" />
            <h2 className="font-serif text-3xl tracking-[0.25em] text-[#d8d3c5]">RESERVATION</h2>
            <div className="h-[1px] w-8 bg-[#d8d3c5]/30" />
          </div>
          <p className="mb-10 sm:mb-14 max-w-md text-center text-base leading-relaxed text-gray-400">
            Secure your spot at Soirée, where exceptional dining and a remarkable experience await.
          </p>

          {success ? (
            <div className="flex flex-col items-center gap-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <span className="text-3xl text-green-400">✓</span>
              </div>
              <div>
                <p className="font-serif text-2xl tracking-[0.2em] text-[#d8d3c5]">RESERVATION CONFIRMED</p>
                <p className="mt-4 text-base text-white/50">We look forward to welcoming you.</p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-xl border border-[#d8d3c5]/30 px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8d3c5] transition-all hover:bg-[#d8d3c5] hover:text-[#0a0a0a]"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid w-full max-w-xl grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 animate-in fade-in duration-500">

              <div className="flex flex-col gap-2">
                <label className="font-serif text-xs uppercase tracking-widest text-[#d8d3c5]/80">Date</label>
                <input
                  type="date"
                  name="reservationDate"
                  value={form.reservationDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-base text-[#d8d3c5] transition-all focus:border-[#d8d3c5]/50 focus:bg-[#1a1a1a] focus:shadow-[0_0_15px_rgba(212,204,182,0.1)] focus:outline-none scheme-dark custom-scrollbar"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif text-xs uppercase tracking-widest text-[#d8d3c5]/80">Time</label>
                <input
                  type="time"
                  name="reservationTime"
                  value={form.reservationTime}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-base text-[#d8d3c5] transition-all focus:border-[#d8d3c5]/50 focus:bg-[#1a1a1a] focus:shadow-[0_0_15px_rgba(212,204,182,0.1)] focus:outline-none scheme-dark custom-scrollbar"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif text-xs uppercase tracking-widest text-[#d8d3c5]/80">Guests</label>
                <select
                  name="numberOfGuests"
                  value={form.numberOfGuests}
                  onChange={handleChange}
                  className="appearance-none rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-base text-[#d8d3c5] transition-all focus:border-[#d8d3c5]/50 focus:bg-[#1a1a1a] focus:shadow-[0_0_15px_rgba(212,204,182,0.1)] focus:outline-none custom-scrollbar cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n} className="bg-[#111] text-[#d8d3c5]">
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                  <option value="9" className="bg-[#111] text-[#d8d3c5]">9+ Guests</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif text-xs uppercase tracking-widest text-[#d8d3c5]/80">
                  Special Requests
                </label>
                <input
                  type="text"
                  name="orderedItem"
                  value={form.orderedItem}
                  onChange={handleChange}
                  placeholder="Allergies, occasions..."
                  className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-base text-[#d8d3c5] placeholder-gray-600 transition-all focus:border-[#d8d3c5]/50 focus:bg-[#1a1a1a] focus:shadow-[0_0_15px_rgba(212,204,182,0.1)] focus:outline-none"
                />
              </div>

              {error && (
                <div className="col-span-1 sm:col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-semibold tracking-wide text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="col-span-1 sm:col-span-2 mt-2 rounded-xl border border-[#d8d3c5]/20 bg-[#151515] py-3.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#d8d3c5] transition-all hover:bg-[#d8d3c5] hover:text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(212,204,182,0.2)] disabled:opacity-40 disabled:hover:bg-[#151515] disabled:hover:text-[#d8d3c5]"
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
