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
  phone?: string;
  username?: string;
  initials: string;
  avatarColor?: string;
  avatarUrl?: string;
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

export type EventStatus = 'pending' | 'settled';
export type ParticipantPaymentStatus = 'paid' | 'pending';
export type PaymentMethod = 'mercadopago' | 'cbu' | 'alias' | 'cash' | 'other';

export interface EventParticipant {
  id: number;
  userId: number;
  name: string;
  initials: string;
  avatarColor?: string;
  amount: number;
  status: ParticipantPaymentStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;
}

export interface Event {
  id: number;
  name: string;
  icon: GroupIconType;
  iconBgColor: string;
  groupId?: number;
  groupName?: string;
  total: number;
  myShare: number;
  status: EventStatus;
  participantCount: number;
  participants: EventParticipant[];
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventSummary {
  collected: number;
  total: number;
  paidCount: number;
  pendingCount: number;
  remainingCount: number;
}

export interface UserBalance {
  pendingToCollect: number;
  pendingToPay: number;
  thisMonthSpent: number;
  thisMonthEvents: number;
}

export interface UserStats {
  friendsCount: number;
  groupsCount: number;
  activeGroupsCount: number;
  paymentsMade: number;
}

export interface PaymentAccount {
  id: number;
  type: PaymentMethod;
  label: string;
  value: string;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  reminders: boolean;
}

export interface PrivacySettings {
  publicProfile: boolean;
  showHistory: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyRequest {
  code: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const API_BASE = '/api';
