import { graphqlService } from './graphqlService';
import { Chat, Message } from '../types/auth';


export interface OpenChatResponse {
  openOrCreateChat: Chat;
}

export interface CreateGroupChatResponse {
  createGroupChat: Chat;
}

export interface GetUserChatsResponse {
  getUserChats: Chat[];
}

export interface GetChatMessagesResponse {
  getChatMessages: Message[];
}

export class ChatApi {
  async openOrCreateChat(otherUserId: string | number): Promise<Chat> {
    const mutation = `
      mutation OpenOrCreateChat($otherUserId: Int!) {
      openOrCreateChat(otherUserId: $otherUserId) {
        id
        isGroup
        name
        participants {
        id
        email
        firstName
        lastName
        avatar
        isOnline
        }
        lastMessage {
        id
        content
        createdAt
        sender {
          id
          firstName
          lastName
          avatar
        }
        }
      }
      }
    `;

    // Ensure the otherUserId is converted to a number for GraphQL
    const numericUserId = typeof otherUserId === 'string' ? parseInt(otherUserId, 10) : otherUserId;
    
    const response = await graphqlService.mutation<OpenChatResponse>(mutation, {
      otherUserId: numericUserId
    });
    return response.openOrCreateChat;
  }

  async createGroupChat(name: string, participantIds: number[]): Promise<Chat> {
    const mutation = `
      mutation CreateGroupChat($name: String!, $participantIds: [Int!]!) {
        createGroupChat(name: $name, participantIds: $participantIds) {
          id
          isGroup
          name
          participants {
            id
            email
            firstName
            lastName
            avatar
            isOnline
          }
          messages {
            id
            content
            createdAt
            sender {
              id
              firstName
              lastName
              avatar
            }
          }
        }
      }
    `;

    const response = await graphqlService.mutation<CreateGroupChatResponse>(mutation, {
      name,
      participantIds
    });
    return response.createGroupChat;
  }

  async getUserChats(): Promise<Chat[]> {
    const query = `
      query GetUserChats {
      getUserChats {
        id
        isGroup
        name
        participants {
        id
        email
        firstName
        lastName
        avatar
        isOnline
        }
        lastMessage {
        id
        content
        createdAt
        sender {
          id
          firstName
          lastName
          avatar
        }
        }
      }
      }
    `;

    const response = await graphqlService.query<GetUserChatsResponse>(query);
    return response.getUserChats;
  }

  async addParticipant(chatId: number, userId: number): Promise<Chat> {
    const mutation = `
      mutation AddParticipant($chatId: Int!, $userId: Int!) {
        addParticipant(chatId: $chatId, userId: $userId) {
          id
          isGroup
          name
          participants {
            id
            email
            firstName
            lastName
            avatar
            isOnline
          }
        }
      }
    `;

    const response = await graphqlService.mutation<{ addParticipant: Chat }>(mutation, {
      chatId,
      userId
    });
    return response.addParticipant;
  }

  async removeParticipant(chatId: number, userId: number): Promise<Chat> {
    const mutation = `
      mutation RemoveParticipant($chatId: Int!, $userId: Int!) {
        removeParticipant(chatId: $chatId, userId: $userId) {
          id
          isGroup
          name
          participants {
            id
            email
            firstName
            lastName
            avatar
            isOnline
          }
        }
      }
    `;

    const response = await graphqlService.mutation<{ removeParticipant: Chat }>(mutation, {
      chatId,
      userId
    });
    return response.removeParticipant;
  }

  async sendMessage(chatId: string, content: string): Promise<Message> {
    const mutation = `
      mutation SendMessage($chatId: ID!, $content: String!) {
        sendMessage(chatId: $chatId, content: $content) {
          id
          content
          createdAt
          sender {
            id
            firstName
            lastName
            avatar
          }
        }
      }
    `;

    const response = await graphqlService.mutation<{ sendMessage: Message }>(mutation, {
      chatId,
      content
    });
    return response.sendMessage;
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    const query = `
      query GetChatMessages($chatId: Int!) {
        getChatMessages(chatId: $chatId) {
          id
          content
          createdAt
          sender {
            id
            firstName
            lastName
            avatar
          }
        }
      }
    `;

    const response = await graphqlService.query<GetChatMessagesResponse>(query, {
      chatId
    });
    return response.getChatMessages;
  }
}

export const chatApi = new ChatApi();
