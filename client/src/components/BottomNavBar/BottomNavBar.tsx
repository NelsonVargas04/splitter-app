import React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import useStoreTheme from '@/stores/StoreTheme';

const navItems = [
  { label: 'Dashboard', icon: <BarChartIcon />, path: '/dashboard' },
  { label: 'Groups', icon: <GroupsIcon />, path: '/groups' },
  { label: 'QR', icon: <QrCodeScannerIcon />, path: '/qr' },
  { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
];

export default function BottomNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useStoreTheme();
  const isDark = mode === 'dark';
  const currentIndex = navItems.findIndex(item => item.path === location.pathname);

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
      bgcolor: isDark ? '#1a1333' : '#ffffff',
      borderTop: isDark ? 'none' : '1px solid #e0e0e0',
    }}>
      <BottomNavigation
        showLabels
        value={currentIndex}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{ bgcolor: 'transparent', height: 64 }}
      >
        {navItems.map((item, idx) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            sx={{
              color: idx === currentIndex ? '#7c4dff' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: '#7c4dff',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.15)',
                },
              },
              '& .MuiSvgIcon-root': {
                transition: 'transform 0.2s ease',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
