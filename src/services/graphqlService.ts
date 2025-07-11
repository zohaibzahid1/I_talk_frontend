const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql'; // Backend GraphQL endpoint

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error instanceof Error ? error : new Error('Unknown GraphQL error');
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
