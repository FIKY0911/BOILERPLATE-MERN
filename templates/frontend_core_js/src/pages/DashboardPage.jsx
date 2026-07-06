import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Example: Fetch some protected data
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/me');
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Welcome Back</h3>
          <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user.name}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Role Status</h3>
          <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
            {user.role.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
        {stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email Address</div>
              <div>{stats.email}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Member Since</div>
              <div>{new Date(stats.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)' }}>Loading account information...</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
