import { nhost } from '../nhost';
import type { User } from '@nhost/nhost-js';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    nhost.onAuthStateChanged(
      (_event: string, session: { user: User } | null) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    const currentUser = nhost.getUser();
    if (currentUser) setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { session, error } = await nhost.signIn({ email, password });
    if (error) return false;
    setUser(session?.user || null);
    return true;
  };

  const logout = () => {
    nhost.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
