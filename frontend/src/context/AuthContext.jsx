import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("internhub_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("internhub_token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Configure Axios default header whenever token changes
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("internhub_token", token);
    } else {
      delete API.defaults.headers.common["Authorization"];
      localStorage.removeItem("internhub_token");
    }
  }, [token]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem("internhub_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("internhub_user");
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to log in. Please check your credentials.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/register", { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("internhub_token");
    localStorage.removeItem("internhub_user");
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
