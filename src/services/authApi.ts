import { graphqlService } from './graphqlService';
import { User, GoogleAuthUrlResponse, CheckAuthStatusResponse, LogoutResponse } from '../types/auth';

export class AuthApi {

  async getGoogleAuthUrl(): Promise<string> {
    const query = `
      query GetGoogleAuthUrl {
        getGoogleAuthUrl
      }
    `;

    try {
      const response = await graphqlService.query<GoogleAuthUrlResponse>(query);
      return response.getGoogleAuthUrl;
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      throw new Error('Failed to initiate Google authentication');
    }
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
      console.error('Auth status check failed:', error);
      return { getCurrentUser: null };
    }
  }

  async logout(): Promise<boolean> {
    const mutation = `
      mutation Logout {
        logout
      }
    `;

    try {
      const response = await graphqlService.mutation<LogoutResponse>(mutation);
      return response.logout;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
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
