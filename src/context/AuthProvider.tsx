import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LoginRequest, LoginResponse, Role, Session, User } from '../types/auth';
import { authApi } from '../api';
import { clearSession as clearStored, getSession as getStored, setSession as setStored } from './sessionStore';

type AuthContextShape = {
  user: User | null;
  isAuthenticated: boolean;
  roles: Role[];
  login: (cred: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
};

const AuthContext = createContext<AuthContextShape | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(getStored());

  useEffect(() => {
    // ensure memory + html state reflect storage on first load
    if (session) setStored(session);
  }, [session]);

  const login = async (cred: LoginRequest) => {
    // call backend (adjust response shape if needed)
    const res = await authApi.login(cred.email, cred.password) as LoginResponse;
    const newSession: Session = {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken ?? null,
      user: res.user,
    };
    setSession(newSession);
    setStored(newSession);
  };

  const logout = () => {
    setSession(null);
    clearStored();
  };

  const value: AuthContextShape = useMemo(() => ({
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.accessToken),
    roles: session?.user?.roles ?? [],
    login,
    logout,
    hasRole: (role: Role) => !!session?.user?.roles?.includes(role),
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
