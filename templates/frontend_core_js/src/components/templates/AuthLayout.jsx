import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '2rem', marginBottom: '0.5rem' }}>MERN<span style={{ color: 'var(--text-primary)'}}>App</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Please enter your details.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
