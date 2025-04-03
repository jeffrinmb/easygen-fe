import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { User, LoginCredentials } from "../types";
import {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  REQUEST_TIMEOUT,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getDefaultHeaders,
} from "./config";

// Create and configure axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: getDefaultHeaders(),
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        removeAuthToken();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiInstance();

export const authService = {
  signUp: async (userData: User): Promise<User> => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.SIGNUP, userData);
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      return response.data.user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to sign up");
    }
  },

  signIn: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.SIGNIN, credentials);
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      return response.data.user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  },

  getProfile: async (): Promise<User | null> => {
    if (!getAuthToken()) {
      return null;
    }

    try {
      const response = await api.get(AUTH_ENDPOINTS.PROFILE);
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        removeAuthToken();
      }
      return null;
    }
  },

  logout: async (): Promise<void> => {
    if (!getAuthToken()) {
      return;
    }

    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      removeAuthToken();
    }
  },

  refreshInstance: (): void => {
    Object.assign(api.defaults, {
      headers: getDefaultHeaders(),
    });
  },
};
