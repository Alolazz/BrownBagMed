'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the alola_auth cookie
      document.cookie = 'alola_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Call logout API (optional, create if needed)
      // await fetch('/api/alola/logout', { method: 'POST' });
      
      // Redirect to login page
      router.push('/alola/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      type="button"
    >
      Logout
    </button>
  );
}
