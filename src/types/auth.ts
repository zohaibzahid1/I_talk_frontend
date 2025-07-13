// User and Authentication Types
export interface User {
  id: string | number; // Handle both string and number IDs from backend
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  googleId?: string | null;
  isOnline?: boolean;
}
export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string | number;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface Chat {
  id: string;
  isGroup: boolean;
  name?: string;
  participants: Array<{
    id: string | number;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isOnline: boolean;
  }>;
  lastMessage?: Message;
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
