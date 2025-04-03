// src/api/auth.ts
import { User, LoginCredentials } from "../types";

// Base API URL - should be configured in your environment variables in a real app
const API_URL = "https://api.example.com"; // Replace with your actual API URL

export const authAPI = {
  // Sign up new user
  signUp: async (userData: User): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred during sign up");
    }
  },

  // Sign in existing user
  signIn: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const data = await response.json();
      // Store the token in localStorage for subsequent requests
      localStorage.setItem("authToken", data.token);
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred during sign in");
    }
  },

  // Get user profile using stored auth token
  getProfile: async (): Promise<User | null> => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If token is invalid or expired, clear it
        if (response.status === 401) {
          localStorage.removeItem("authToken");
        }
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  // Logout - invalidate token on server side
  logout: async (): Promise<void> => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      // Always remove token from localStorage regardless of API call success
      localStorage.removeItem("authToken");
    }
  },
};
