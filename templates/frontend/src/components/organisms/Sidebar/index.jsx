import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Workspaces', path: '/workspaces', icon: '🏢' },
    { name: 'Team', path: '/team', icon: '👥' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6 text-2xl font-bold text-indigo-500">
        SaaS Logo
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <span className="mr-3">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
