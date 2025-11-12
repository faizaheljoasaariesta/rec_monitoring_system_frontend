import React, { useState, useEffect, useMemo, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext, defaultAuthState, type AuthState, type User } from './AuthContext';

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
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuth(defaultAuthState);
        }
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, isAuthenticated: true, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(defaultAuthState);
  };

  const value = useMemo(() => ({ auth, loading, login, logout }), [auth, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
