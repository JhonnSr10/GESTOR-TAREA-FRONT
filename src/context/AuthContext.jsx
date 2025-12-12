
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada al iniciar
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    // Simulación de validación de credenciales
    // En un caso real, esto llamaría a tu backend
    if (username === 'admin' && password === 'admin') {
      const userData = {
        name: 'Administrador',
        username: username,
        role: 'admin',
        avatar: '/avatar-placeholder.png'
      };
      setUser(userData);
      localStorage.setItem('user_session', JSON.stringify(userData));
      return { success: true };
    } else if (username && password) {
       // Permitir cualquier otro usuario para pruebas, pero sin rol admin
       const userData = {
        name: username,
        username: username,
        role: 'user',
        avatar: '/avatar-placeholder.png'
      };
      setUser(userData);
      localStorage.setItem('user_session', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Credenciales inválidas' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
