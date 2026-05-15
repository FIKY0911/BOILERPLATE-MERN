import { useState, useEffect } from 'react';
import { getDecodedToken, isAuthenticated, logout as authLogout } from '../services/authService.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const decoded = getDecodedToken();
        setUser(decoded);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return { user, loading, logout, isAuthenticated: !!user };
};
