import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, getToken, setToken } from '../lib/api';

export type Role = 'admin' | 'employee';

export interface EmployeeProfile {
  id: number;
  employeeId: string;
  fullName: string;
  designation: string | null;
  workLocation: string | null;
  mobileNumber: string | null;
  profilePhoto: string | null;
  status: string;
}

export interface AuthUser {
  id: number;
  name?: string | null;
  loginId: string;
  role: Role;
  mustResetPassword: boolean;
  lastLoginAt?: string | null;
  employee?: EmployeeProfile | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  ready: boolean;
  login: (loginId: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const USER_KEY = 'me_user';

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed === 'object' && 'role' in parsed) return parsed;
    return null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore storage errors
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => (getToken() ? readStoredUser() : null));
  const [ready, setReady] = useState(false);

  const persistAuth = useCallback((token: string, u: AuthUser) => {
    setToken(token);
    storeUser(u);
    setUser(u);
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    storeUser(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setReady(true);
      return;
    }
    try {
      const data = await api.get<{ user: AuthUser }>('/api/auth/me');
      setUser(data.user);
      storeUser(data.user);
    } catch (err) {
      clearAuth();
    } finally {
      setReady(true);
    }
  }, [clearAuth]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (loginId: string, password: string): Promise<AuthUser> => {
      const data = await api.post<{ token: string; user: AuthUser }>('/api/auth/login', { loginId, password });
      persistAuth(data.token, data.user);
      return data.user;
    },
    [persistAuth]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Even if the request fails we must clear the local session.
    }
    clearAuth();
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isEmployee: user?.role === 'employee',
      ready,
      login,
      logout,
      refresh,
    }),
    [user, ready, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/** Public helpers used outside components where a hook is not convenient. */
export function getUserRole(): Role | null {
  try {
    const u = readStoredUser();
    return u ? u.role : null;
  } catch {
    return null;
  }
}