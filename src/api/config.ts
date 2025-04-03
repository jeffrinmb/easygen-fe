export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

export const AUTH_ENDPOINTS = {
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  PROFILE: "/auth/user",
  LOGOUT: "/auth/signout",
};

export const REQUEST_TIMEOUT = 10000;

export const TOKEN_STORAGE_KEY = "authToken";

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};
