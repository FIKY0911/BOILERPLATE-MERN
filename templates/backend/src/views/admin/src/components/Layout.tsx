import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import axios from 'axios';

interface LayoutProps {
  children: ReactNode;
  user: { name: string; role: string; avatar?: string } | null;
}

export default function Layout({ children, user }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <LayoutDashboard size={24} color="var(--primary-color)" />
          <span>Admin Panel</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <UserIcon size={20} />
            Profile
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'white' }}>
            {user?.name || 'Admin User'}
          </div>
          <span className="role-badge">{user?.role || 'Admin'}</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="user-menu">
            <div className="avatar" style={{ overflow: 'hidden' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}
