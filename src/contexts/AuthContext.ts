import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextType {
  auth: AuthState;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const defaultAuthState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

export const AuthContext = createContext<AuthContextType>({
  auth: defaultAuthState,
  loading: true,
  login: () => {},
  logout: () => {},
});
