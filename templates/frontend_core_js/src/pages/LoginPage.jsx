import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.875rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}
      <FormField 
        label="Email Address" 
        id="email" 
        type="email" 
        placeholder="admin@admin.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <FormField 
        label="Password" 
        id="password" 
        type="password" 
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <Button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
        <LogIn size={18} />
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginPage;
