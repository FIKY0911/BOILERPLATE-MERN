import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { LogOut } from 'lucide-react';
import Button from '../atoms/Button';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-color)' }}>
        MERN<span style={{ color: 'var(--text-primary)' }}>App</span>
      </div>
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.role}</div>
          </div>
          <Button variant="outline" onClick={logout} style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <LogOut size={16} />
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
