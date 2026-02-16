let nextId = 1000;

function generateId(): number {
  return nextId++;
}

function generateFriendCode(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function generateToken(): string {
  return 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    '#7c4dff', '#ff6b6b', '#4ecdc4', '#45b7d1',
    '#96ceb4', '#ffeaa7', '#dfe6e9', '#ff7675',
    '#74b9ff', '#a29bfe', '#fd79a8', '#00b894'
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

// ---- Types ----

interface UserRecord {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  initials: string;
  avatarColor: string;
  avatarUrl: string;
  friendCode: string;
  isGuest: boolean;
  verified: boolean;
  verificationCode: string;
  createdAt: Date;
}

interface GroupRecord {
  id: number;
  name: string;
  icon: string;
  iconBgColor: string;
  createdById: number;
  members: { id: number; name: string; initials: string; avatarColor: string }[];
  createdAt: Date;
}

interface FriendRecord {
  id: number;
  userId: number;
  friendId: number;
  addedAt: Date;
}

interface FriendRequestRecord {
  id: number;
  fromUserId: number;
  toUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

interface EventRecord {
  id: number;
  name: string;
  icon: string;
  iconBgColor: string;
  groupId: number | null;
  total: number;
  createdById: number;
  participants: {
    id: number;
    userId: number;
    amount: number;
    status: 'paid' | 'pending';
    paymentMethod: string;
    paidAt: Date | null;
  }[];
  status: 'pending' | 'settled';
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentAccountRecord {
  id: number;
  userId: number;
  type: string;
  label: string;
  value: string;
}

interface NotificationSettingsRecord {
  userId: number;
  push: boolean;
  email: boolean;
  sms: boolean;
  reminders: boolean;
}

interface PrivacySettingsRecord {
  userId: number;
  publicProfile: boolean;
  showHistory: boolean;
}

interface TokenRecord {
  token: string;
  userId: number;
  createdAt: Date;
}

// ---- In-Memory Store ----

const db = {
  users: [] as UserRecord[],
  groups: [] as GroupRecord[],
  friends: [] as FriendRecord[],
  friendRequests: [] as FriendRequestRecord[],
  events: [] as EventRecord[],
  paymentAccounts: [] as PaymentAccountRecord[],
  notificationSettings: [] as NotificationSettingsRecord[],
  privacySettings: [] as PrivacySettingsRecord[],
  tokens: [] as TokenRecord[],
};

export {
  db,
  generateId,
  generateFriendCode,
  generateToken,
  generateVerificationCode,
  getInitials,
  getAvatarColor,
  UserRecord,
  GroupRecord,
  FriendRecord,
  FriendRequestRecord,
  EventRecord,
  PaymentAccountRecord,
  NotificationSettingsRecord,
  PrivacySettingsRecord,
  TokenRecord,
};
