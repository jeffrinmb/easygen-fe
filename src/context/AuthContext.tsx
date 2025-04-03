import React, { createContext, useState, useEffect } from "react";
import { User, LoginCredentials, AuthContextType } from "../types";
import { authService } from "../api/authAxios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
      } catch (err) {
        console.error("Error Checking Logged In:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const signUp = async (userData: User): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.signUp(userData);
      setUser(newUser);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.signIn(credentials);
      setUser(loggedInUser);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
