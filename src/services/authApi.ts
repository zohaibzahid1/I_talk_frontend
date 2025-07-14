import { graphqlService } from './graphqlService';
import { toast } from 'react-toastify';
import { GoogleAuthUrlResponse, CheckAuthStatusResponse, LogoutResponse } from '../types/auth';

export class AuthApi {

  async getGoogleAuthUrl(): Promise<string> {
    const query = `
      query GetGoogleAuthUrl {
        getGoogleAuthUrl
      }
    `;

    const response = await graphqlService.query<GoogleAuthUrlResponse>(query);
    return response.getGoogleAuthUrl;
  }

  async checkAuthStatus(): Promise<CheckAuthStatusResponse> {
    const query = `
      query GetCurrentUser {
        getCurrentUser {
          id
          email
          firstName
          lastName
          avatar
          googleId
        }
      }
    `;

    try {
      const response = await graphqlService.query<CheckAuthStatusResponse>(query);
      return response;
    } catch (error) {
      // For auth status check, we don't want to show error notifications
      // Just return null to indicate not authenticated
      console.log('Auth status check failed:', error);
      return { getCurrentUser: null };
    }
  }

  async logout(): Promise<boolean> {
    const mutation = `
      mutation Logout {
        logout
      }
    `;

    const response = await graphqlService.mutation<LogoutResponse>(mutation);
    toast.success('Successfully logged out');
    return response.logout;
  }
  async validateToken(): Promise<boolean> {
    const query = `
      query ValidateToken {
        validateToken
      }
    `;

    try {
      const response = await graphqlService.query<{ validateToken: boolean }>(query);
      return response.validateToken;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}

export const authApi = new AuthApi();
