import { graphqlService } from './graphqlService';
import { User } from '@/types/auth';

export interface GetAllUsersResponse {
  getAllUsers: User[];
}

export class UsersApi {
  async getAllUsers(): Promise<User[]> {
    const query = `
      query GetAllUsers {
        getAllUsers {
          id
          email
          firstName
          lastName
          avatar
          isOnline
        }
      }
    `;

    const response = await graphqlService.query<GetAllUsersResponse>(query);
    return response.getAllUsers;
  }
}

export const usersApi = new UsersApi();
