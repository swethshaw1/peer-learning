import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

interface UserContextType {
  user: User | null;
  isAuthLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading, logout: authLogout, fetchMe } = useAuthStore();

  useEffect(() => {
    // Sync session on mount
    fetchMe();
  }, [fetchMe]);

  const login = (userData: any) => {
    // The authStore handles login, but we provide this for compatibility
    // with older code that calls useUser().login
    useAuthStore.setState({ 
      user: userData, 
      token: userData.token || null,
      isAuthenticated: true 
    });
  };

  const logout = () => {
    authLogout();
  };

  const contextValue = React.useMemo(() => ({ 
    user, 
    isAuthLoading, 
    login, 
    logout 
  }), [user, isAuthLoading, logout]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within UserProvider');
  return context;
};