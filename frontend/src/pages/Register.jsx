import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Mail, Lock, Phone, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_TENANT');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await registerUser({
        fullName,
        email,
        phone,
        password,
        role,
      });

      confetti({ particleCount: 70, spread: 60 });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Home className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Free Account
          </h1>
          <p className="text-xs text-slate-500">
            Join SmartRent AI to discover or lease homes smarter
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">I am joining as a:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('ROLE_TENANT')}
                className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                  role === 'ROLE_TENANT'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/10'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👤 Tenant / Renter
              </button>
              <button
                type="button"
                onClick={() => setRole('ROLE_LANDLORD')}
                className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                  role === 'ROLE_LANDLORD'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏠 Property Owner
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Password (min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
