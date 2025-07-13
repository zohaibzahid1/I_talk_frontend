import { autorun, makeAutoObservable } from "mobx";
import { authApi} from '../services/authApi';
import { User } from '../types/auth';
import { LocalStorageService } from '../services/localStorageService';

export class LoginStore {
    isLoading = false;
    isAuthenticated = false;
    user: User | null = null;
    error: string | null = null;
    private rootStore: any; // Will be properly typed later to avoid circular dependency
    
    constructor(rootStore?: any) {
        this.rootStore = rootStore;
        // Initialize the API service
        makeAutoObservable(this);
        // Initialize from local storage only on client side
        if (typeof window !== 'undefined') {
            this.initializeFromStorage();
        }
        
        autorun(() => {
            if (this.isAuthenticated) {
                console.log('User is authenticated:', this.user);
                // Save to local storage when authenticated (only on client)
                if (typeof window !== 'undefined') {
                    LocalStorageService.saveUser(this.user);
                }
            } else {
                console.log('User is not authenticated');
                // Clear local storage when not authenticated (only on client)
                if (typeof window !== 'undefined') {
                    LocalStorageService.saveUser(null);
                }
            }
        });
        
    }

    initializeFromStorage() {
        if (LocalStorageService.isAvailable()) {
            const savedUser = LocalStorageService.getUser();
            const savedAuthStatus = LocalStorageService.getIsAuthenticated();
            
            if (savedUser && savedAuthStatus) {
                this.user = savedUser;
                this.isAuthenticated = true;
            }
        }
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setAuthenticated(authenticated: boolean) {
        this.isAuthenticated = authenticated;
        
    }

    setUser(user: User | null) {
        this.user = user;
        this.isAuthenticated = !!user;
    }

    setError(error: string | null) {
        this.error = error;
    }

    clearError() {
        this.error = null;
    }

    async checkAuthStatus(force = false) {  
        // Check Here if access token is expired then get a new token from refresh token
        console.log("Auth check initiated")
        try {
            this.setLoading(true);
            
            const response = await authApi.checkAuthStatus();  

            if (response.getCurrentUser) {
                this.setUser(response.getCurrentUser);
                this.setAuthenticated(true);
                
                // Connect to socket server if token exists
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                if (token && this.rootStore?.socketStore) {
                    this.rootStore.socketStore.connect(token);
                }
                
                console.log('Auth check successful - user found');
            } else {
                this.setAuthenticated(false);
                console.log('Auth check - no user found');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.setAuthenticated(false);
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        try {
            await authApi.logout();
            
            // Disconnect from socket server
            if (this.rootStore?.socketStore) {
                this.rootStore.socketStore.disconnect();
            }
            
            // Clear local state
            this.setUser(null);
            this.setAuthenticated(false);
            this.clearError();
            // Clear local storage
            LocalStorageService.clearStorage();
        } catch (error) {
            console.error('Logout failed:', error);
            
            // Disconnect from socket server even if logout fails
            if (this.rootStore?.socketStore) {
                this.rootStore.socketStore.disconnect();
            }
            
            // Even if the server logout fails, clear local state
            this.setUser(null);
            this.setAuthenticated(false);
            LocalStorageService.clearStorage();
        }
    }
    handleGoogleLogin = async () => {
        try {
            this.setLoading(true);
            this.clearError();
            const authUrl = await authApi.getGoogleAuthUrl();
            window.location.href = authUrl;
        } catch (error: any) {
            this.setError(error.message || 'Failed to initiate login. Please try again.');
            this.setLoading(false);
        }
    };
}