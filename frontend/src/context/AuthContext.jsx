import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMyProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smart_rent_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('smart_rent_token');
      const storedUser = localStorage.getItem('smart_rent_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
          // Refresh profile in background
          const res = await getMyProfile();
          setUser(res.data);
          localStorage.setItem('smart_rent_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Failed to refresh user profile:', err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loginUser = async (email, password) => {
    const res = await apiLogin({ email, password });
    const { token: jwt, ...userData } = res.data;
    setToken(jwt);
    setUser(userData);
    localStorage.setItem('smart_rent_token', jwt);
    localStorage.setItem('smart_rent_user', JSON.stringify(userData));
    return userData;
  };

  const registerUser = async (data) => {
    const res = await apiRegister(data);
    const { token: jwt, ...userData } = res.data;
    setToken(jwt);
    setUser(userData);
    localStorage.setItem('smart_rent_token', jwt);
    localStorage.setItem('smart_rent_user', JSON.stringify(userData));
    return userData;
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smart_rent_token');
    localStorage.removeItem('smart_rent_user');
  };

  const isTenant = user?.role === 'ROLE_TENANT';
  const isLandlord = user?.role === 'ROLE_LANDLORD';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        isAuthenticated: !!token,
        isTenant,
        isLandlord,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
