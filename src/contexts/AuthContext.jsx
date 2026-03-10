import React, { createContext, useContext, useState } from 'react';

// Credenciales de las 7 casas (autenticación local, sin backend)
const USUARIOS = {
  casa1: { password: 'watios1', casaId: 1 },
  casa2: { password: 'watios2', casaId: 2 },
  casa3: { password: 'watios3', casaId: 3 },
  casa4: { password: 'watios4', casaId: 4 },
  casa5: { password: 'watios5', casaId: 5 },
  casa6: { password: 'watios6', casaId: 6 },
  casa7: { password: 'watios7', casaId: 7 },
};

const AuthContext = createContext(null);

function getInitialUser() {
  try {
    const stored = localStorage.getItem('watios_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getInitialUser);

  const login = (username, password) => {
    const user = USUARIOS[username.toLowerCase()];
    if (!user) return { success: false, error: 'Usuario no encontrado' };
    if (user.password !== password) return { success: false, error: 'Contraseña incorrecta' };

    const userData = { username: username.toLowerCase(), casaId: user.casaId };
    setCurrentUser(userData);
    localStorage.setItem('watios_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('watios_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
