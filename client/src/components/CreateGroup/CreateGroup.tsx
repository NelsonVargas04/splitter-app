import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import {
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
  Close,
  Add,
} from '@mui/icons-material';
import { GroupIconType, Friend } from '@/models/domain';
import useStoreTheme from '@/stores/StoreTheme';
import { fadeInUp, scaleIn, bounceIn } from '@/utils/animations';

interface CreateGroupProps {
  friends: Friend[];
  onCreateGroup: (groupData: {
    name: string;
    icon: GroupIconType;
    iconBgColor: string;
    members: number[];
  }) => void;
  onClose: () => void;
}

const GROUP_ICONS = {
  sports_soccer: { icon: SportsSoccer, label: 'Soccer' },
  work: { icon: Work, label: 'Work' },
  restaurant: { icon: Restaurant, label: 'Food' },
  home: { icon: Home, label: 'Home' },
  flight: { icon: Flight, label: 'Travel' },
  beach: { icon: BeachAccess, label: 'Beach' },
  celebration: { icon: Celebration, label: 'Parties' },
  music: { icon: MusicNote, label: 'Music' },
  shopping: { icon: ShoppingBag, label: 'Shopping' },
  fitness: { icon: FitnessCenter, label: 'Fitness' },
  pets: { icon: Pets, label: 'Pets' },
  school: { icon: School, label: 'Education' },
};

const COLORS = [
  '#7c4dff', '#ff6b6b', '#4ecdc4', '#45b7d1', 
  '#96ceb4', '#ffeaa7', '#dfe6e9', '#ff7675',
  '#74b9ff', '#a29bfe', '#fd79a8', '#00b894',
  '#e17055', '#0984e3', '#6c5ce7', '#e84393'
];

const CreateGroup: React.FC<CreateGroupProps> = ({
  friends,
  onCreateGroup,
  onClose,
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<GroupIconType>('sports_soccer');
  const [selectedColor, setSelectedColor] = useState('#7c4dff');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { mode } = useStoreTheme();
  const isDark = mode === 'dark';

  const handleFriendToggle = (friendId: number) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      onCreateGroup({
        name: groupName.trim(),
        icon: selectedIcon,
        iconBgColor: selectedColor,
        members: selectedFriends,
      });
    }
  };

  const SelectedIcon = GROUP_ICONS[selectedIcon].icon;

  return (
    <>
      <Dialog
        open={true}
        onClose={onClose}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: isDark ? '#121212' : '#f8f9fa',
          },
        }}
      >
        {/* Header estilo app */}
        <Box sx={{ background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)', p: 2, pb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <IconButton onClick={onClose} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <Close />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#fff' }}>
              Create group
            </Typography>
            <Box sx={{ width: 40 }} />
          </Stack>
        </Box>

        <DialogContent sx={{ pt: 3, px: 2, pb: 20 }}>
          {/* Nombre del grupo */}
          <TextField
            fullWidth
            label="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mb: 4 }}
            placeholder="E.g.: Soccer friends"
            size="medium"
          />

          {/* Personalización */}
          <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 3, color: isDark ? '#e0e0e0' : '#374151' }}>
            Customization
          </Typography>
          
          {/* Vista previa centrada */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: selectedColor,
                  width: 80,
                  height: 80,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                  animation: `${bounceIn} 0.5s ease-out`,
                }}
              >
                <SelectedIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Avatar>
              <Typography sx={{ fontSize: 12, color: isDark ? '#9ca3af' : '#9ca3af', fontWeight: 500 }}>
                Group preview
              </Typography>
            </Box>
          </Box>

          {/* Selectores en columna */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setShowIconPicker(true)}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderColor: isDark ? '#424242' : '#d1d5db',
                color: isDark ? '#e0e0e0' : '#374151',
                height: 56,
                fontSize: 14,
                '&:hover': {
                  borderColor: selectedColor,
                  bgcolor: `${selectedColor}08`,
                },
              }}
            >
              <SelectedIcon sx={{ mr: 2, fontSize: 24 }} />
              {GROUP_ICONS[selectedIcon].label}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setShowColorPicker(true)}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderColor: isDark ? '#424242' : '#d1d5db',
                color: isDark ? '#e0e0e0' : '#374151',
                height: 56,
                fontSize: 14,
                '&:hover': {
                  borderColor: selectedColor,
                  bgcolor: `${selectedColor}08`,
                },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: selectedColor,
                  mr: 2,
                }}
              />
              Group color
            </Button>
          </Stack>

          {/* Añadir amigos */}
          <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 3, color: isDark ? '#e0e0e0' : '#374151' }}>
            Add friends ({selectedFriends.length})
          </Typography>
          
          {friends.length === 0 ? (
            <Typography sx={{ color: '#9ca3af', fontStyle: 'italic', py: 4, textAlign: 'center' }}>
              You don't have any friends added yet
            </Typography>
          ) : (
            <Box sx={{ maxHeight: 240, overflow: 'auto', border: isDark ? '1px solid #424242' : '1px solid #e5e7eb', borderRadius: 2, p: 2, bgcolor: isDark ? '#1e1e1e' : 'transparent' }}>
              {friends.map((friend) => (
                <FormControlLabel
                  key={friend.id}
                  control={
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => handleFriendToggle(friend.id)}
                      sx={{
                        color: selectedColor,
                        '&.Mui-checked': {
                          color: selectedColor,
                        },
                      }}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          bgcolor: friend.avatarColor,
                          width: 32,
                          height: 32,
                          fontSize: 14,
                        }}
                      >
                        {friend.initials}
                      </Avatar>
                      <Typography sx={{ fontSize: 14 }}>
                        {friend.name}
                      </Typography>
                    </Stack>
                  }
                  sx={{ width: '100%', m: 0, py: 0.5 }}
                />
              ))}
            </Box>
          )}

          {selectedFriends.length > 0 && (
            <Box sx={{ mt: 3, p: 3, bgcolor: isDark ? '#1e1e1e' : '#f9fafb', borderRadius: 2 }}>
              <Typography sx={{ fontSize: 14, color: isDark ? '#e0e0e0' : '#374151', mb: 2, fontWeight: 600 }}>
                Selected members ({selectedFriends.length}):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedFriends.map((friendId) => {
                  const friend = friends.find(f => f.id === friendId);
                  return friend ? (
                    <Chip
                      key={friend.id}
                      label={friend.name}
                      size="small"
                      onDelete={() => handleFriendToggle(friend.id)}
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: friend.avatarColor,
                            width: 20,
                            height: 20,
                            fontSize: 10,
                          }}
                        >
                          {friend.initials}
                        </Avatar>
                      }
                      sx={{
                        bgcolor: `${selectedColor}15`,
                        color: selectedColor,
                        '& .MuiChip-deleteIcon': {
                          color: selectedColor,
                        },
                      }}
                    />
                  ) : null;
                })}
              </Stack>
            </Box>
          )}
        </DialogContent>

        {/* Botón inferior estilo app */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            px: 2,
            py: 2,
            bgcolor: isDark ? '#121212' : '#f8f9fa',
            zIndex: 1000,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateGroup}
            disabled={!groupName.trim()}
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
              '&:disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
              },
            }}
            startIcon={<Add />}
          >
            Create group
          </Button>
        </Box>
      </Dialog>

      {/* Icon Picker Dialog */}
      <Dialog
        open={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            animation: `${scaleIn} 0.25s ease-out`,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 3, fontSize: 18, fontWeight: 600 }}>
          Choose an icon for your group
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="center">
            {Object.entries(GROUP_ICONS).map(([key, { icon: Icon, label }]) => (
              <Box key={key} sx={{ width: 'calc(25% - 12px)', minWidth: 80 }}>
                <Button
                  variant={selectedIcon === key ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedIcon(key as GroupIconType);
                    setShowIconPicker(false);
                  }}
                  sx={{
                    width: '100%',
                    height: 80,
                    flexDirection: 'column',
                    gap: 1,
                    bgcolor: selectedIcon === key ? selectedColor : 'transparent',
                    borderColor: selectedIcon === key ? selectedColor : '#e5e7eb',
                    '&:hover': {
                      bgcolor: selectedIcon === key ? selectedColor : '#f9fafb',
                      borderColor: selectedColor,
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 32 }} />
                  <Typography sx={{ fontSize: 11, textTransform: 'none' }}>{label}</Typography>
                </Button>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Color Picker Dialog */}
      <Dialog
        open={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            animation: `${scaleIn} 0.25s ease-out`,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 3, fontSize: 18, fontWeight: 600 }}>
          Choose a color for your group
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="center">
            {COLORS.map((color) => (
              <Box key={color} sx={{ width: 'calc(20% - 12px)', minWidth: 60 }}>
                <Button
                  variant={selectedColor === color ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedColor(color);
                    setShowColorPicker(false);
                  }}
                  sx={{
                    width: '100%',
                    height: 60,
                    bgcolor: color,
                    borderColor: selectedColor === color ? '#000' : color,
                    borderWidth: selectedColor === color ? 3 : 1,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: color,
                      filter: 'brightness(0.9)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateGroup;