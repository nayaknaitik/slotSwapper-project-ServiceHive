'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    try {
      setLoading(true);
      await login(email, password);
      router.push('/');
    } catch (error: any) {
      console.error(error);
      setErr(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-100 px-4">
      <div className="w-full max-w-md bg-[#1e293b]/90 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl text-white font-bold mb-6 text-center bg-clip-text">
          Welcome Back
        </h2>

        {err && (
          <div className="text-red-400 mb-4 text-sm bg-red-900/30 border border-red-800 rounded-md p-2 text-center">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
