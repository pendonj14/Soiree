import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ onClose, redirectTo }) => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setSuccessMsg('');
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      onClose();
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.username, form.email, form.password);
      setSuccessMsg('Account created — please sign in.');
      setForm({ firstName: '', lastName: '', username: '', email: form.email, password: '' });
      setTab('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0c] p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-white/30 hover:text-white transition-colors text-lg leading-none"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-[1px] w-6 bg-[#d8d3c5]/30" />
            <h2 className="font-serif text-xl tracking-[0.25em] text-[#d8d3c5]">
              {tab === 'login' ? 'WELCOME BACK' : 'JOIN US'}
            </h2>
            <div className="h-[1px] w-6 bg-[#d8d3c5]/30" />
          </div>
          <p className="text-xs text-white/40 tracking-wide">
            {tab === 'login'
              ? 'Sign in to reserve your table'
              : 'Create an account to get started'}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex border-b border-white/10">
          {[
            { key: 'login', label: 'Sign In' },
            { key: 'register', label: 'Register' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex-1 pb-3 text-[10px] uppercase tracking-widest transition-colors ${
                tab === key
                  ? 'border-b border-white text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={tab === 'login' ? handleLogin : handleRegister}
          className="flex flex-col gap-4"
        >
          {tab === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#d8d3c5]/50">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Jane"
                    required
                    className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#d8d3c5]/50">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Smith"
                    required
                    className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#d8d3c5]/50">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="janesmith"
                  required
                  className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-[#d8d3c5]/50">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-[#d8d3c5]/50">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 text-sm text-gray-300 placeholder-gray-600 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}
          {successMsg && (
            <p className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-400">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-white py-3 text-[10px] uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading
              ? 'Please wait...'
              : tab === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
