import { makeAutoObservable } from 'mobx';
import { User } from '@/types/auth';
import { usersApi } from '@/services/usersApi';


export class UserSelectorStore {
  users: User[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  isGroupMode: boolean = false;
  selectedUsers: User[] = [];
  groupName: string = '';
  isOpen: boolean = false;
  

  constructor() {
    makeAutoObservable(this);
  }
  
  setIsOpen(isOpen: boolean, userId: string) {
    this.isOpen = isOpen;
    if (isOpen) {
      this.loadUsers(userId);
    }
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
  }

  setIsGroupMode(isGroupMode: boolean) {
    this.isGroupMode = isGroupMode;
    if (!isGroupMode) {
      this.selectedUsers = [];
      this.groupName = '';
    }
  }

  setGroupName(name: string) {
    this.groupName = name;
  }

  toggleUserSelection(user: User) {
    const isSelected = this.selectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    } else {
      this.selectedUsers = [...this.selectedUsers, user];
    }
  }

  async loadUsers(currentUserId?: string) {
    this.loading = true;
    try {
      const allUsers = await usersApi.getAllUsers();
      // Filter out current user
      this.users = currentUserId 
        ? allUsers.filter(user => String(user.id) !== currentUserId)
        : allUsers;
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      this.loading = false;
    }
  }

  get filteredUsers() {
    if (!this.searchTerm) return this.users;
    
    const searchLower = this.searchTerm.toLowerCase();
    return this.users.filter(user => 
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  }

  get canCreateGroup() {
    return this.selectedUsers.length >= 2 && this.groupName.trim().length > 0;
  }

  get selectionCount() {
    return this.selectedUsers.length;
  }

  reset() {
    this.isGroupMode = false;
    this.selectedUsers = [];
    this.groupName = '';
    this.searchTerm = '';
  }

  close() {
    this.isOpen = false;
    this.reset();
  }
}

export const userSelectorStore = new UserSelectorStore();
