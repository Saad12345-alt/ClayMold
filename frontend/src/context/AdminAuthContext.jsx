import React, { createContext, useState, useContext } from 'react';

const AdminAuthContext = createContext();

const readSavedSession = () => {
  const token = localStorage.getItem('adminToken');
  const savedAdmin = localStorage.getItem('adminUser');
  if (!token || !savedAdmin) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return null;
  }

  try {
    return { token, admin: JSON.parse(savedAdmin) };
  } catch {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return null;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSavedSession);
  const admin = session?.admin || null;
  const token = session?.token || null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.token) throw new Error('Login response did not include an admin token');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      setSession({ admin: data.admin, token: data.token });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setSession(null);
  };

  const authenticatedFetch = async (input, init = {}) => {
    if (!token) {
      logout();
      throw new Error('Admin authentication required');
    }
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(input, { ...init, headers });
    if (response.status === 401) logout();
    return response;
  };

  const isAuthenticated = !!admin && !!token;

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, login, logout, authenticatedFetch, isAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
