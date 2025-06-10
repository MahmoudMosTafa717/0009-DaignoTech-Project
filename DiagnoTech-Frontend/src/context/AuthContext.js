import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("jwt");
    return !!token;
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });

  const login = (token, role) => {
    localStorage.setItem("jwt", token);
    
    if (role) {
      localStorage.setItem("userRole", role);
      setUserRole(role);
    }
    
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const getUserRole = () => {
    return userRole;
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      logout,
      userRole,
      getUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);