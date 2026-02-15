// Domain models / interfaces used across the app

export interface Person {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  payerId: number;
  participants: number[];
}

export interface SplitItem {
  id: number;
  name: string;
  balance: number;
}

export interface GroupMember {
  id: number;
  name: string;
  initials: string;
  avatarColor?: string;
}

export type GroupIconType = 
  | 'sports_soccer'
  | 'work'
  | 'restaurant'
  | 'home'
  | 'flight'
  | 'beach'
  | 'celebration'
  | 'music'
  | 'shopping'
  | 'fitness'
  | 'pets'
  | 'school';

export interface Group {
  id: number;
  name: string;
  icon: GroupIconType;
  iconBgColor: string;
  createdAt: Date;
  members: GroupMember[];
}

export interface Friend {
  id: number;
  name: string;
  initials: string;
  avatarColor?: string;
  email?: string;
  phone?: string;
  friendCode: string;
  addedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  initials: string;
  avatarColor?: string;
  friendCode: string;
  createdAt: Date;
}

export interface FriendRequest {
  id: number;
  fromUserId: number;
  fromUserName: string;
  fromUserInitials: string;
  fromUserAvatarColor?: string;
  toUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export const API_BASE = '/api';
