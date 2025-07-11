import { User } from '../types/auth';

const STORAGE_KEYS = {
  USER: 'chatapp_user',
  IS_AUTHENTICATED: 'chatapp_is_authenticated',
} as const;

export class LocalStorageService {
  // Save user to local storage
  static saveUser(user: User | null): void {
    if (!this.isAvailable()) return;
    
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'false');
      }
    } catch (error) {
      console.error('Failed to save user to local storage:', error);
    }
  }

  // Get user from local storage
  static getUser(): User | null {
    if (!this.isAvailable()) return null;
    
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get user from local storage:', error);
      return null;
    }
  }

  // Get authentication status from local storage
  static getIsAuthenticated(): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      return isAuthenticated === 'true';
    } catch (error) {
      console.error('Failed to get authentication status from local storage:', error);
      return false;
    }
  }

  // Clear all local storage data
  static clearStorage(): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    } catch (error) {
      console.error('Failed to clear local storage:', error);
    }
  }
  // Check if local storage is available (for SSR compatibility)
  static isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }
}
