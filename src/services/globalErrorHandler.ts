import { notificationService } from './notificationService';

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;

  private constructor() {}

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  init(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Check if it's an authentication error
      if (event.reason?.message?.toLowerCase().includes('unauthorized') ||
          event.reason?.message?.toLowerCase().includes('authentication')) {
        // Don't show notification as GraphQLService already handles this
        return;
      }

      // Show a generic error message for other unhandled rejections
      notificationService.showError('An unexpected error occurred. Please try again.');
      
      // Prevent the default browser error handling
      event.preventDefault();
    });

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      // Show a generic error message
      notificationService.showError('An unexpected error occurred. Please refresh the page.');
    });
  }

  // Method to manually handle errors with navigation
  handleCriticalError(error: any, redirectToHome: boolean = true): void {
    console.error('Critical error:', error);
    
    notificationService.showError('A critical error occurred. Redirecting...');
    
    if (redirectToHome && typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
