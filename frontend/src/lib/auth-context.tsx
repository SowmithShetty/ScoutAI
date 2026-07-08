"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, TokenResponse } from "./types";
import { authApi } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; role?: string }) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const storedToken = localStorage.getItem("scoutai_access_token");
    const storedUser = localStorage.getItem("scoutai_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (data: TokenResponse) => {
    localStorage.setItem("scoutai_access_token", data.access_token);
    localStorage.setItem("scoutai_refresh_token", data.refresh_token);
    localStorage.setItem("scoutai_user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    setError(null);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      handleAuthSuccess(response.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Invalid email or password";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; full_name: string; role?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      handleAuthSuccess(response.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Registration failed. Email might already be taken.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.guestLogin();
      handleAuthSuccess(response.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Guest login failed.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("scoutai_access_token");
    localStorage.removeItem("scoutai_refresh_token");
    localStorage.removeItem("scoutai_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        guestLogin,
        logout,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
