// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  googleId?: string | null;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export interface GoogleAuthUrlResponse {
  getGoogleAuthUrl: string;
}

export interface CheckAuthStatusResponse {
  getCurrentUser: User | null;
}

export interface LogoutResponse {
  logout: boolean;
}

// GraphQL Response wrapper
export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}
