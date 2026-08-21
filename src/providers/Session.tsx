'use client';

import { User } from '@/lib/types/user';
import { createContext, ReactNode, useContext, useState } from 'react';

type SessionContextType = {
  user: User | null;
  authenticated: boolean;
  refreshUser: () => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  async function refreshUser() {
    // const fresh = await getSessionUser();
    // setUser(fresh);
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        authenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx)
    throw new Error(`Missing wrapper provider: ${SessionProvider.name}`);
  return ctx;
}
