import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  token: string | null;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('starlight_admin_token'));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('starlight_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verify token validity on load
    if (token) {
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Session invalid');
        })
        .then(data => {
          if (data.user) {
            setAdminUser(data.user);
            localStorage.setItem('starlight_admin_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Token expired
          setToken(null);
          setAdminUser(null);
          localStorage.removeItem('starlight_admin_token');
          localStorage.removeItem('starlight_admin_user');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = (newToken: string, user: AdminUser) => {
    setToken(newToken);
    setAdminUser(user);
    localStorage.setItem('starlight_admin_token', newToken);
    localStorage.setItem('starlight_admin_user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('starlight_admin_token');
    localStorage.removeItem('starlight_admin_user');
  };

  const getAuthHeaders = (): Record<string, string> => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
        getAuthHeaders
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
