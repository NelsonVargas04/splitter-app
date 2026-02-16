import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Avatar,
  AvatarGroup,
  Chip,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Search,
  SportsSoccer,
  Work,
  Restaurant,
  Home,
  Flight,
  BeachAccess,
  Celebration,
  MusicNote,
  ShoppingBag,
  FitnessCenter,
  Pets,
  School,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '@/components/BottomNavBar';
import useStoreGroups from '@/stores/StoreGroups';
import useStoreTheme from '@/stores/StoreTheme';
import ServiceGroups from '@/services/ServiceGroups';
import AddFriend from '@/components/AddFriend';
import { CreateGroup } from '@/components/CreateGroup';
import { Group, Friend } from '@/models/domain';
import { fadeInUp, scaleIn } from '@/utils/animations';

const GROUP_ICONS = {
  sports_soccer: SportsSoccer,
  work: Work,
  restaurant: Restaurant,
  home: Home,
  flight: Flight,
  beach: BeachAccess,
  celebration: Celebration,
  music: MusicNote,
  shopping: ShoppingBag,
  fitness: FitnessCenter,
  pets: Pets,
  school: School,
};

const PageGroups: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const { mode } = useStoreTheme();
  const isDark = mode === 'dark';
  
  const {
    groups,
    friends,
    currentUser,
    activeTab,
    searchQuery,
    setGroups,
    setFriends,
    setCurrentUser,
    setActiveTab,
    setSearchQuery,
    getFilteredGroups,
    getFilteredFriends,
    createGroup,
  } = useStoreGroups();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsData, friendsData] = await Promise.all([
          ServiceGroups.fetchGroups(),
          ServiceGroups.fetchFriends(),
        ]);
        setGroups(groupsData);
        setFriends(friendsData);

        const userData = await import('@/services/ServiceUsers').then(m => m.default.getMe());
        setCurrentUser(userData);
      } catch {
        // Data will remain empty if API is unavailable
      }
    };
    loadData();
  }, [setGroups, setFriends, setCurrentUser]);

  const filteredGroups = getFilteredGroups();
  const filteredFriends = getFilteredFriends();

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'groups' | 'friends') => {
    setActiveTab(newValue);
  };

  const handleSendFriendRequest = async (code: string): Promise<{ success: boolean; message: string }> => {
    return ServiceGroups.sendFriendRequest(code);
  };

  const renderMemberAvatars = (members: Group['members'], maxVisible = 3) => {
    const visibleMembers = members.slice(0, maxVisible);
    const extraCount = members.length - maxVisible;

    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <AvatarGroup max={maxVisible + 1} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
          {visibleMembers.map((member) => (
            <Avatar
              key={member.id}
              sx={{ bgcolor: member.avatarColor || '#7c4dff', width: 28, height: 28, fontSize: 12 }}
            >
              {member.initials}
            </Avatar>
          ))}
          {extraCount > 0 && (
            <Avatar sx={{ bgcolor: '#9e9e9e', width: 28, height: 28, fontSize: 10 }}>
              +{extraCount}
            </Avatar>
          )}
        </AvatarGroup>
        <Typography sx={{ color: 'text.secondary', fontSize: 13, ml: 1 }}>
          {members.length} members
        </Typography>
      </Stack>
    );
  };

  const renderGroupCard = (group: Group, index: number) => {
    const IconComponent = GROUP_ICONS[group.icon] || SportsSoccer;
    
    return (
      <Box
        key={group.id}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 2,
          mb: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          cursor: 'pointer',
          animation: `${fadeInUp} 0.4s ease-out ${index * 0.08}s both`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          '&:active': {
            transform: 'translateY(-2px) scale(1)',
          },
        }}
        onClick={() => navigate(`/groups/${group.id}`)}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            sx={{
              bgcolor: group.iconBgColor,
              width: 48,
              height: 48,
            }}
          >
            <IconComponent sx={{ fontSize: 24, color: '#fff' }} />
          </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, color: 'text.primary', mb: 0.5 }}>
            {group.name}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>
            Created {ServiceGroups.formatTimeAgo(group.createdAt)}
          </Typography>
          {renderMemberAvatars(group.members)}
        </Box>
      </Stack>
    </Box>
    );
  };

  const renderFriendCard = (friend: Friend, index: number) => (
    <Box
      key={friend.id}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 2,
        mb: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        animation: `${fadeInUp} 0.4s ease-out ${index * 0.08}s both`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.01)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        '&:active': {
          transform: 'translateY(-2px) scale(1)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: friend.avatarColor || '#7c4dff',
            width: 48,
            height: 48,
            fontSize: 18,
          }}
        >
          {friend.initials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, color: 'text.primary' }}>
            {friend.name}
          </Typography>
          {friend.email && (
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              {friend.email}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)', p: 2, pb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Groups & Friends</Typography>
          <Box sx={{ width: 40 }} /> {/* Spacer to center title */}
        </Stack>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search groups or friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 3,
              color: '#fff',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255,255,255,0.6)',
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(255,255,255,0.6)' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 15,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'primary.main',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab value="groups" label="Groups" />
          <Tab value="friends" label="Friends" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, pb: 20 }}>
        {activeTab === 'groups' && (
          <>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary', mb: 2 }}>
              My Groups ({filteredGroups.length})
            </Typography>
            {filteredGroups.map((group, index) => renderGroupCard(group, index))}
            {filteredGroups.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: 'text.secondary' }}>
                  {searchQuery ? 'No groups found' : 'You don\'t have any groups yet'}
                </Typography>
              </Box>
            )}
          </>
        )}

        {activeTab === 'friends' && (
          <>
            {currentUser && (
              <AddFriend
                myFriendCode={currentUser.friendCode}
                onSendRequest={handleSendFriendRequest}
              />
            )}
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary', mb: 2 }}>
              My Friends ({filteredFriends.length})
            </Typography>
            {filteredFriends.map((friend, index) => renderFriendCard(friend, index))}
            {filteredFriends.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: 'text.secondary' }}>
                  {searchQuery ? 'No friends found' : 'You don\'t have any friends added'}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Botón inferior de ancho completo */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 70, // Encima del BottomNavBar
          left: 0,
          right: 0,
          px: 2,
          py: 1.5,
          bgcolor: 'transparent',
          zIndex: 1000,
          animation: `${fadeInUp} 0.5s ease-out 0.3s both`,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => {
            if (activeTab === 'groups') {
              setShowCreateGroup(true);
            } else {
              setShowAddFriend(true);
            }
          }}
          sx={{
            height: 52,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: 15,
            fontWeight: 600,
            background: 'linear-gradient(90deg, #7c4dff, #5e35b1)',
            boxShadow: '0 4px 16px rgba(124, 77, 255, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': { 
              background: 'linear-gradient(90deg, #6a3de8, #4a2a9a)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(124, 77, 255, 0.5)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
          startIcon={<Add />}
        >
          {activeTab === 'groups' ? 'Create new group' : 'Add friend'}
        </Button>
      </Box>

      <BottomNavBar />

      {/* Create Group Dialog */}
      {showCreateGroup && (
        <CreateGroup
          friends={friends}
          onCreateGroup={async (groupData) => {
            try {
              await ServiceGroups.createGroup({
                name: groupData.name,
                icon: groupData.icon,
                iconBgColor: groupData.iconBgColor,
                members: groupData.members.map(id => {
                  const friend = friends.find(f => f.id === id);
                  return {
                    id,
                    name: friend?.name || 'Member',
                    initials: friend?.initials || 'M',
                    avatarColor: friend?.avatarColor || '#7c4dff',
                  };
                }),
              });
              const updatedGroups = await ServiceGroups.fetchGroups();
              setGroups(updatedGroups);
            } catch {
              createGroup(groupData);
            }
            setShowCreateGroup(false);
          }}
          onClose={() => setShowCreateGroup(false)}
        />
      )}

      {/* Add Friend Dialog */}
      {showAddFriend && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2,
          }}
          onClick={() => setShowAddFriend(false)}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 3,
              maxWidth: 400,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddFriend
              myFriendCode={currentUser?.friendCode || ''}
              onSendRequest={async (code) => {
                const result = await ServiceGroups.sendFriendRequest(code);
                if (result.success) {
                  setShowAddFriend(false);
                }
                return result;
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PageGroups;
