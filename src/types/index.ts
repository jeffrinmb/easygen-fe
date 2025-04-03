export interface User {
  email: string;
  name: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (userData: User) => Promise<void>;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}
