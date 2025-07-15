import { autorun, makeAutoObservable } from "mobx";
import { authApi} from '../services/authApi';
import { User } from '../types/auth';
import { LocalStorageService } from '../services/localStorageService';
import socketService from '../services/socketService';
import { RootStore } from "./rootStore";

export class LoginStore {
    isLoading = false;
    isAuthenticated = false;
    user: User | null = null;
    error: string | null = null;
    private rootStore: any; // Will be properly typed later to avoid circular dependency
    
    constructor(rootStore?: RootStore) {
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
                // Connect socket for authenticated users on page refresh
                socketService.connect();
                // Set user online status after connection
                setTimeout(() => {
                    if (socketService.connected && this.user) {
                        socketService.setUserOnline(this.user.id.toString());
                    }
                }, 500);
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

    async checkAuthStatus() {  
        // Check Here if access token is expired then get a new token from refresh token
        try {
            this.setLoading(true);
            
            const response = await authApi.checkAuthStatus();  

            if (response.getCurrentUser) {
                this.setUser(response.getCurrentUser);
                this.setAuthenticated(true);
                socketService.connect();
                // Set user online status after connection
                setTimeout(() => {
                    if (socketService.connected && this.user) {
                        socketService.setUserOnline(this.user.id.toString());
                    }
                }, 500);
                
            } else {
                this.setAuthenticated(false);
                
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
            
            // Clean up chat store socket listeners
            if (this.rootStore?.chatStore) {
                this.rootStore.chatStore.cleanup();
            }
            
            // Disconnect from socket server
            socketService.disconnect();
            // Clear local state
            this.setUser(null);
            this.setAuthenticated(false);
            this.clearError();
            // Clear local storage
            LocalStorageService.clearStorage();
        } catch (error) {
            console.error('Logout failed:', error);
            
            // Clean up chat store socket listeners even if logout fails
            if (this.rootStore?.chatStore) {
                this.rootStore.chatStore.cleanup();
            }
            
            // Disconnect from socket server even if logout fails
            socketService.disconnect();
            
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
        } catch (error: unknown) {
            this.setError(error instanceof Error ? error.message : 'Failed to initiate login. Please try again.');
            this.setLoading(false);
        }
    };
}