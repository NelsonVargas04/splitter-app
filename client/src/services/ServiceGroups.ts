import { Group, Friend, GroupMember, API_BASE, User, FriendRequest } from '@/models/domain';

const ServiceGroups = {
  async fetchGroups(): Promise<Group[]> {
    const response = await fetch(`${API_BASE}/groups`);
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json();
  },

  async fetchGroup(id: number): Promise<Group> {
    const response = await fetch(`${API_BASE}/groups/${id}`);
    if (!response.ok) throw new Error('Failed to fetch group');
    return response.json();
  },

  async createGroup(data: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    const response = await fetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create group');
    return response.json();
  },

  async updateGroup(id: number, data: Partial<Group>): Promise<Group> {
    const response = await fetch(`${API_BASE}/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update group');
    return response.json();
  },

  async deleteGroup(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/groups/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete group');
  },

  async addMember(groupId: number, member: Omit<GroupMember, 'id'>): Promise<GroupMember> {
    const response = await fetch(`${API_BASE}/groups/${groupId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error('Failed to add member');
    return response.json();
  },

  async removeMember(groupId: number, memberId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/groups/${groupId}/members/${memberId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove member');
  },

  async fetchFriends(): Promise<Friend[]> {
    const response = await fetch(`${API_BASE}/friends`);
    if (!response.ok) throw new Error('Failed to fetch friends');
    return response.json();
  },

  async addFriend(data: Omit<Friend, 'id' | 'addedAt'>): Promise<Friend> {
    const response = await fetch(`${API_BASE}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add friend');
    return response.json();
  },

  async removeFriend(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/friends/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove friend');
  },

  async sendFriendRequest(friendCode: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/friends/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendCode }),
    });
    if (!response.ok) {
      const error = await response.json();
      return { success: false, message: error.message || 'Failed to send request' };
    }
    return { success: true, message: 'Request sent successfully!' };
  },

  async fetchFriendRequests(): Promise<FriendRequest[]> {
    const response = await fetch(`${API_BASE}/friends/requests`);
    if (!response.ok) throw new Error('Failed to fetch friend requests');
    return response.json();
  },

  async respondToFriendRequest(
    requestId: number,
    accept: boolean
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/friends/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accept }),
    });
    if (!response.ok) {
      return { success: false, message: 'Failed to process request' };
    }
    return {
      success: true,
      message: accept ? 'Friend added!' : 'Request rejected',
    };
  },

  async findUserByCode(friendCode: string): Promise<User | null> {
    const response = await fetch(`${API_BASE}/users/find?code=${friendCode}`);
    if (!response.ok) return null;
    return response.json();
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
