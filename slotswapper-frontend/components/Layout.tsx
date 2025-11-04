'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            SlotSwapper
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            {user ? (
              <>
                <Link
                  href="/events"
                  className="hover:text-blue-400 transition-colors"
                >
                  My Events
                </Link>
                <Link
                  href="/marketplace"
                  className="hover:text-blue-400 transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  href="/requests"
                  className="hover:text-blue-400 transition-colors"
                >
                  Requests
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                  <span className="text-gray-400 text-sm">
                    Hi, <span className="text-blue-300 font-semibold">{user.name}</span>
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Signup
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
