import React, { useState, useEffect, useMemo, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext, defaultAuthState, type AuthState, type User } from './auth-context';
import { logoutUser } from '@/services/api/users/actions';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setAuth({
            token,
            isAuthenticated: true,
            user: JSON.parse(user),
          });
        } else {
          handleLogoutExpired();
        }
      } catch (err) {
        console.error('Invalid token:', err);
        handleLogoutExpired();
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, isAuthenticated: true, user });
  };

  const handleLogoutExpired = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await logoutUser();
      }
    } catch (err) {
      console.error('Auto logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth(defaultAuthState);
    }
  };

  const logout = async () => {
    try {
      if (auth.token) {
        await logoutUser();
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Gagal logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth(defaultAuthState);
      toast.success('Logout berhasil');
    }
  };

  const value = useMemo(() => ({ auth, loading, login, logout }), [auth, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
