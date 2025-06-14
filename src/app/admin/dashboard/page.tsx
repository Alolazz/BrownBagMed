'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPaymentDashboard from '@/app/components/AdminPaymentDashboard';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to handle admin login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // In production, you'd call an API endpoint to verify this password
    // For development purposes, we're simplifying this
    if (process.env.NODE_ENV === 'development' || password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // In production, this would set a secure HttpOnly cookie via an API call
      // For now, we'll just store it in state
      const token = 'development-admin-token'; // In production, this would come from the server
      setAdminToken(token);
      setIsAuthenticated(true);
    } else {
      setError('Invalid password');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Brown Bag Med Admin Dashboard
          </h1>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Log Out
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto mt-10">
            <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign In
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={() => router.push('/')}
                  type="button"
                >
                  Return to Home
                </button>
              </div>
            </form>
          </div>
        ) : (
          <AdminPaymentDashboard adminToken={adminToken} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Brown Bag Med. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
