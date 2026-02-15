import { create } from 'zustand';
import { Group, Friend, GroupMember, User, FriendRequest, GroupIconType } from '@/models/domain';

interface GroupsState {
  groups: Group[];
  friends: Friend[];
  currentUser: User | null;
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
  activeTab: 'groups' | 'friends';
  searchQuery: string;

  setGroups: (groups: Group[]) => void;
  setFriends: (friends: Friend[]) => void;
  setCurrentUser: (user: User | null) => void;
  setFriendRequests: (requests: FriendRequest[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: 'groups' | 'friends') => void;
  setSearchQuery: (query: string) => void;
  
  addGroup: (group: Group) => void;
  updateGroup: (id: number, updates: Partial<Group>) => void;
  removeGroup: (id: number) => void;
  createGroup: (groupData: {
    name: string;
    icon: GroupIconType;
    iconBgColor: string;
    members: number[];
  }) => Group;
  
  addFriend: (friend: Friend) => void;
  removeFriend: (id: number) => void;
  
  addFriendRequest: (request: FriendRequest) => void;
  updateFriendRequest: (id: number, status: FriendRequest['status']) => void;
  
  addMemberToGroup: (groupId: number, member: GroupMember) => void;
  removeMemberFromGroup: (groupId: number, memberId: number) => void;
  
  getFilteredGroups: () => Group[];
  getFilteredFriends: () => Friend[];
  getPendingRequests: () => FriendRequest[];
}

const useStoreGroups = create<GroupsState>((set, get) => ({
  groups: [],
  friends: [],
  currentUser: null,
  friendRequests: [],
  isLoading: false,
  error: null,
  activeTab: 'groups',
  searchQuery: '',

  setGroups: (groups) => set({ groups }),
  setFriends: (friends) => set({ friends }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setFriendRequests: (friendRequests) => set({ friendRequests }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addGroup: (group) => set((state) => ({ 
    groups: [...state.groups, group] 
  })),

  updateGroup: (id, updates) => set((state) => ({
    groups: state.groups.map((g) => 
      g.id === id ? { ...g, ...updates } : g
    )
  })),

  removeGroup: (id) => set((state) => ({
    groups: state.groups.filter((g) => g.id !== id)
  })),

  createGroup: (groupData: {
    name: string;
    icon: GroupIconType;
    iconBgColor: string;
    members: number[];
  }) => {
    const newGroup: Group = {
      id: Date.now(), // En producción usar el ID del backend
      name: groupData.name,
      icon: groupData.icon,
      iconBgColor: groupData.iconBgColor,
      members: groupData.members.map(id => ({ 
        id, 
        name: 'Miembro', 
        initials: 'M', 
        avatarColor: '#7c4dff' 
      })),
      createdAt: new Date(),
    };
    set((state) => ({ groups: [...state.groups, newGroup] }));
    return newGroup;
  },

  addFriend: (friend) => set((state) => ({
    friends: [...state.friends, friend]
  })),

  removeFriend: (id) => set((state) => ({
    friends: state.friends.filter((f) => f.id !== id)
  })),

  addFriendRequest: (request) => set((state) => ({
    friendRequests: [...state.friendRequests, request]
  })),

  updateFriendRequest: (id, status) => set((state) => ({
    friendRequests: state.friendRequests.map((r) =>
      r.id === id ? { ...r, status } : r
    )
  })),

  addMemberToGroup: (groupId, member) => set((state) => ({
    groups: state.groups.map((g) =>
      g.id === groupId 
        ? { ...g, members: [...g.members, member] }
        : g
    )
  })),

  removeMemberFromGroup: (groupId, memberId) => set((state) => ({
    groups: state.groups.map((g) =>
      g.id === groupId
        ? { ...g, members: g.members.filter((m) => m.id !== memberId) }
        : g
    )
  })),

  getFilteredGroups: () => {
    const { groups, searchQuery } = get();
    if (!searchQuery.trim()) return groups;
    const query = searchQuery.toLowerCase();
    return groups.filter((g) => 
      g.name.toLowerCase().includes(query) ||
      g.members.some((m) => m.name.toLowerCase().includes(query))
    );
  },

  getFilteredFriends: () => {
    const { friends, searchQuery } = get();
    if (!searchQuery.trim()) return friends;
    const query = searchQuery.toLowerCase();
    return friends.filter((f) =>
      f.name.toLowerCase().includes(query) ||
      f.email?.toLowerCase().includes(query) ||
      f.friendCode.includes(query)
    );
  },

  getPendingRequests: () => {
    const { friendRequests } = get();
    return friendRequests.filter((r) => r.status === 'pending');
  },
}));

export default useStoreGroups;
