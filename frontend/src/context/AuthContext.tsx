import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../api/client';

interface AuthState {
  token: string | null;
  email: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function decode(token: string | null): { username?: string; roles?: string[]; exp?: number } | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const t = tokenStore.get();
    const p = decode(t);
    return p?.exp && p.exp * 1000 > Date.now() ? t : null;
  });
  const payload = decode(token);

  const login = async (email: string, password: string) => {
    const { token: t } = await api.login(email, password);
    tokenStore.set(t);
    setToken(t);
  };
  const logout = () => { tokenStore.set(null); setToken(null); };

  return (
    <AuthContext.Provider value={{
      token,
      email: payload?.username ?? null,
      isAdmin: !!payload?.roles?.includes('ROLE_ADMIN'),
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
