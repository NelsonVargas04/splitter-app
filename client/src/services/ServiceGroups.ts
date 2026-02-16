import { Group, Friend, GroupMember, User, FriendRequest } from '@/models/domain';
import Backend from '@/services/Backend';

const ServiceGroups = {
  async fetchGroups(): Promise<Group[]> {
    return Backend.get<Group[]>('/groups');
  },

  async fetchGroup(id: number): Promise<Group> {
    return Backend.get<Group>(`/groups/${id}`);
  },

  async createGroup(data: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    return Backend.post<Group>('/groups', data);
  },

  async updateGroup(id: number, data: Partial<Group>): Promise<Group> {
    return Backend.put<Group>(`/groups/${id}`, data);
  },

  async deleteGroup(id: number): Promise<void> {
    return Backend.delete(`/groups/${id}`);
  },

  async addMember(groupId: number, member: Omit<GroupMember, 'id'>): Promise<GroupMember> {
    return Backend.post<GroupMember>(`/groups/${groupId}/members`, member);
  },

  async removeMember(groupId: number, memberId: number): Promise<void> {
    return Backend.delete(`/groups/${groupId}/members/${memberId}`);
  },

  async fetchFriends(): Promise<Friend[]> {
    return Backend.get<Friend[]>('/friends');
  },

  async addFriend(data: Omit<Friend, 'id' | 'addedAt'>): Promise<Friend> {
    return Backend.post<Friend>('/friends', data);
  },

  async removeFriend(id: number): Promise<void> {
    return Backend.delete(`/friends/${id}`);
  },

  async sendFriendRequest(friendCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await Backend.post<{ success: boolean; message: string }>('/friends/request', { friendCode });
      return result;
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to send request' };
    }
  },

  async fetchFriendRequests(): Promise<FriendRequest[]> {
    return Backend.get<FriendRequest[]>('/friends/requests');
  },

  async respondToFriendRequest(
    requestId: number,
    accept: boolean
  ): Promise<{ success: boolean; message: string }> {
    try {
      await Backend.put(`/friends/requests/${requestId}`, { accept });
      return {
        success: true,
        message: accept ? 'Friend added!' : 'Request rejected',
      };
    } catch {
      return { success: false, message: 'Failed to process request' };
    }
  },

  async findUserByCode(friendCode: string): Promise<User | null> {
    try {
      return await Backend.get<User>(`/users/find?code=${friendCode}`);
    } catch {
      return null;
    }
  },

  generateFriendCode(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  },

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  },

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  generateAvatarColor(name: string): string {
    const colors = [
      '#7c4dff', '#ff6b6b', '#4ecdc4', '#45b7d1', 
      '#96ceb4', '#ffeaa7', '#dfe6e9', '#ff7675',
      '#74b9ff', '#a29bfe', '#fd79a8', '#00b894'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  },
};

export default ServiceGroups;
