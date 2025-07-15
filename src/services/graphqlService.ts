
import { toast } from 'react-toastify';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export class GraphQLService {
  private endpoint: string;

  constructor(endpoint: string = GRAPHQL_ENDPOINT) {
    this.endpoint = endpoint;
  }

  private handleError(error: Error, response?: Response): void {
    // Check if it's an authentication error
    if (response?.status === 401 || 
        error.message?.toLowerCase().includes('unauthorized') ||
        error.message?.toLowerCase().includes('authentication') ||
        error.message?.toLowerCase().includes('not authenticated')) {
      
      // Show user-friendly message
      toast.error('Your session has expired. Please log in again.', {
        autoClose: 1500
      });
      
      // Clear any stored authentication data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
      
      // Redirect to login page after toast shows
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }, 2000);
      return;
    }

    // For any other error, show error and redirect to home page
    toast.error('Something went wrong. Redirecting to home page...', {
      autoClose: 1500
    });
    
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }, 2000);
  }

  async request<T>(query: string, variables?: any): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for JWT authentication
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        this.handleError(error, response);
        return Promise.reject(error); // Don't throw, just reject
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        const error = new Error(result.errors[0].message);
        this.handleError(error, response);
        return Promise.reject(error); // Don't throw, just reject
      }

      return result.data;
    } catch (error) {
      // Handle network errors, fetch failures, etc.
      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.handleError(error);
      } else if (error instanceof Error && !error.message?.includes('HTTP error')) {
        // Only handle if it's not already handled above
        this.handleError(error);
      }
      
      return Promise.reject(error instanceof Error ? error : new Error('Unknown GraphQL error'));
    }
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    return this.request<T>(query, variables);
  }

  async mutation<T>(mutation: string, variables?: any): Promise<T> {
    return this.request<T>(mutation, variables);
  }
}


export const graphqlService = new GraphQLService();
