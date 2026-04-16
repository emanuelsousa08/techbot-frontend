import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: Date;
}

interface UserSession {
  user: User | null;
  isLoggedIn: boolean;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  login: (userData: User) => void;
}

const DEFAULT_USER: User = {
  id: "user_" + Date.now(),
  name: "Usuário",
  email: "usuario@localhost",
  avatar: "U",
  joinDate: new Date(),
};

export function useUserSession(): UserSession {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("techbot_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        parsedUser.joinDate = new Date(parsedUser.joinDate);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        initializeDefaultUser();
      }
    }
  }, []);

  const initializeDefaultUser = () => {
    setUser(DEFAULT_USER);
    setIsLoggedIn(true);
    localStorage.setItem("techbot_user", JSON.stringify(DEFAULT_USER));
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("techbot_user", JSON.stringify(updatedUser));
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("techbot_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("techbot_user");
  };

  return {
    user,
    isLoggedIn,
    updateUser,
    logout,
    login,
  };
}
