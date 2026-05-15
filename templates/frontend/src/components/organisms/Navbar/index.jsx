import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-1.5 focus:outline-none focus:border-indigo-500 text-sm w-64"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-white relative">
          <span>🔔</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'User'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'G'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
