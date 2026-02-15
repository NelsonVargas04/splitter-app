import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Box, Stack, Typography, IconButton, Avatar, Button, TextField, Switch, Divider, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaletteIcon from '@mui/icons-material/Palette';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BottomNavBar from '@/components/BottomNavBar';
import { useNavigate } from 'react-router-dom';
import useStoreTheme from '@/stores/StoreTheme';
import { fadeInUp, scaleIn } from '@/utils/animations';

const mockUser = {
  initials: 'JD',
  name: 'Juan Diaz',
  email: 'juan.diaz@email.com',
  phone: '+54 9 11 1234-5678',
  username: '@juandiaz',
  paymentAccounts: [
    { type: 'Mercado Pago', value: 'juan.diaz.mp' },
    { type: 'CBU', value: '0170099220000012345678' },
    { type: 'Bank Alias', value: 'JUAN.DIAZ.BANCO' },
  ],
  notifications: {
    push: true,
    email: true,
    sms: false,
    reminders: true,
  },
  privacy: {
    publicProfile: true,
    showHistory: false,
  },
};

const PageProfile: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [editMode, setEditMode] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ type: '', value: '' });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  
  const { mode, toggleTheme } = useStoreTheme();
  const isDark = mode === 'dark';

  useEffect(() => {
    if (qrOpen) {
      const qrCodeRegionId = 'qr-reader';
      qrReaderRef.current = new Html5Qrcode(qrCodeRegionId);
      
      qrReaderRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setQrResult(decodedText);
          qrReaderRef.current?.stop();
        },
        (errorMessage) => {
          // Handle scan error silently
        }
      ).catch((err) => {
        console.error('Unable to start scanning', err);
      });
    }

    return () => {
      if (qrReaderRef.current?.isScanning) {
        qrReaderRef.current.stop().catch(() => {});
      }
    };
  }, [qrOpen]);

  const handleAddQrAccount = () => {
    if (qrResult) {
      setUser((prev) => ({
        ...prev,
        paymentAccounts: [...prev.paymentAccounts, { type: 'QR', value: qrResult }],
      }));
      setQrResult(null);
      setQrOpen(false);
    }
  };

  const handleToggle = (section: 'notifications' | 'privacy', key: string) => {
    setUser((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleAddAccount = () => {
    if (!newAccount.type || !newAccount.value) return;
    setUser((prev) => ({
      ...prev,
      paymentAccounts: [...prev.paymentAccounts, newAccount],
    }));
    setNewAccount({ type: '', value: '' });
    setShowAddAccount(false);
  };

  const handleRemoveAccount = (idx: number) => {
    setUser((prev) => ({
      ...prev,
      paymentAccounts: prev.paymentAccounts.filter((_, i) => i !== idx),
    }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  // Handler para el QR de la barra inferior
  useEffect(() => {
    // Escuchar evento custom para abrir QR desde la barra
    const handler = (e: any) => {
      if (e.detail === 'open-qr') setQrOpen(true);
    };
    window.addEventListener('open-qr-modal', handler);
    return () => window.removeEventListener('open-qr-modal', handler);
  }, []);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header sticky */}
      <Box sx={{
        background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)',
        p: 2,
        pb: 7,
        mb: 2,
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>My Profile</Typography>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} onClick={() => setEditMode((e) => !e)}>
            {editMode ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Stack>
      </Box>

      {/* Content scrolleable */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, pt: 0, pb: 14, minHeight: 0 }}>
        {/* Avatar Section */}
        <Stack alignItems="center" mt={2} mb={4}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarUrl || undefined}
              sx={{ width: 110, height: 110, fontSize: 44, fontWeight: 700, bgcolor: '#7c4dff', border: '5px solid #fff', boxShadow: '0 4px 16px rgba(124,77,255,0.3)', objectFit: 'cover' }}
            >
              {!avatarUrl && user.initials}
            </Avatar>
            <IconButton
              sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: '#7c4dff', color: '#fff', border: '3px solid #fff', width: 36, height: 36, boxShadow: 2, '&:hover': { bgcolor: '#5e35b1' } }}
              onClick={handleAvatarClick}
              component="span"
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary', mt: 1.5 }}>{user.name}</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{user.email}</Typography>
        </Stack>

        {/* Stats */}
        <Stack direction="row" gap={2} mb={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 3, 
              textAlign: 'center', 
              bgcolor: 'background.paper',
              animation: `${fadeInUp} 0.4s ease-out 0.1s both`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            <GroupAddIcon sx={{ fontSize: 32, color: 'primary.main', mb: 0.5 }} />
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary' }}>12</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Active groups</Typography>
          </Paper>
          <Paper 
            elevation={2} 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 3, 
              textAlign: 'center', 
              bgcolor: 'background.paper',
              animation: `${fadeInUp} 0.4s ease-out 0.2s both`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 0.5 }} />
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary' }}>45</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Payments made</Typography>
          </Paper>
        </Stack>

        {/* Personal Info */}
        <Paper elevation={2} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: 'background.paper' }}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <PersonIcon sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Personal Information</Typography>
          </Stack>
          <Stack gap={2}>
            <TextField label="Full Name" value={user.name} InputProps={{ readOnly: !editMode }} size="small" fullWidth />
            <TextField label="Email" value={user.email} InputProps={{ readOnly: !editMode }} size="small" fullWidth />
            <TextField label="Phone" value={user.phone} InputProps={{ readOnly: !editMode }} size="small" fullWidth />
            <TextField label="Username" value={user.username} InputProps={{ readOnly: !editMode }} size="small" fullWidth />
          </Stack>
        </Paper>

        {/* Payment Info - Multiple Accounts + QR */}
        <Paper elevation={2} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: 'background.paper' }}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <CreditCardIcon sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Payment Information</Typography>
            {editMode && (
              <Button variant="outlined" size="small" sx={{ ml: 'auto', borderRadius: 2, color: '#7c4dff', borderColor: '#7c4dff' }} onClick={() => setQrOpen(true)}>
                Scan QR
              </Button>
            )}
          </Stack>
          <Stack gap={2}>
            {user.paymentAccounts.map((acc, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'action.hover' }}>
                <AccountBalanceIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{acc.type}</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary', wordBreak: 'break-all' }}>{acc.value}</Typography>
                </Box>
                {editMode && (
                  <IconButton size="small" color="error" onClick={() => handleRemoveAccount(idx)}>
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            ))}
            {editMode && (
              <>
                {showAddAccount ? (
                  <Stack direction="row" gap={1} alignItems="center">
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      size="small"
                      label="Type"
                      value={newAccount.type}
                      onChange={e => setNewAccount(a => ({ ...a, type: e.target.value }))}
                      sx={{ minWidth: 120 }}
                    >
                      <option value="">Select</option>
                      <option value="Mercado Pago">Mercado Pago</option>
                      <option value="CBU">CBU</option>
                      <option value="Bank Alias">Bank Alias</option>
                      <option value="Other">Other</option>
                    </TextField>
                    <TextField
                      size="small"
                      label="Value"
                      value={newAccount.value}
                      onChange={e => setNewAccount(a => ({ ...a, value: e.target.value }))}
                      sx={{ flex: 1 }}
                    />
                    <Button variant="contained" size="small" sx={{ minWidth: 0, px: 2, borderRadius: 2, background: '#7c4dff' }} onClick={handleAddAccount}>Add</Button>
                    <Button variant="text" size="small" color="inherit" onClick={() => setShowAddAccount(false)}>Cancel</Button>
                  </Stack>
                ) : (
                  <Button variant="outlined" size="small" sx={{ borderRadius: 2, color: '#7c4dff', borderColor: '#7c4dff', mt: 1 }} onClick={() => setShowAddAccount(true)}>
                    Add account
                  </Button>
                )}
              </>
            )}
          </Stack>
          {/* QR Modal */}
          {qrOpen && (
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(30,16,60,0.85)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 3, boxShadow: 6, minWidth: 320, maxWidth: '90vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Scan QR Code</Typography>
                <Box id="qr-reader" sx={{ width: '100%', maxWidth: 300, '& video': { borderRadius: 2 } }} />
                {qrResult && (
                  <>
                    <Typography sx={{ mt: 2, mb: 1, fontSize: 14, color: '#6b7280', wordBreak: 'break-all' }}>Result: {qrResult}</Typography>
                    <Button variant="contained" sx={{ background: '#7c4dff', borderRadius: 2, mb: 1 }} onClick={handleAddQrAccount}>Add as account</Button>
                  </>
                )}
                <Button variant="text" color="inherit" onClick={() => { setQrOpen(false); setQrResult(null); }} sx={{ mt: 1 }}>Close</Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Notifications */}
        <Paper elevation={2} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: 'background.paper' }}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <NotificationsActiveIcon sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Notifications</Typography>
          </Stack>
          <Stack gap={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>Push Notifications</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Receive alerts on your device</Typography>
              </Box>
              <Switch checked={user.notifications.push} onChange={() => handleToggle('notifications', 'push')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#7c4dff' } }} />
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>Email Notifications</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Receive reminder emails</Typography>
              </Box>
              <Switch checked={user.notifications.email} onChange={() => handleToggle('notifications', 'email')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#7c4dff' } }} />
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>SMS Notifications</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Receive text messages</Typography>
              </Box>
              <Switch checked={user.notifications.sms} onChange={() => handleToggle('notifications', 'sms')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#7c4dff' } }} />
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>Automatic Reminders</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Send reminders for pending payments</Typography>
              </Box>
              <Switch checked={user.notifications.reminders} onChange={() => handleToggle('notifications', 'reminders')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#7c4dff' } }} />
            </Stack>
          </Stack>
        </Paper>

        {/* Privacy & Security */}
        <Paper elevation={2} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: 'background.paper' }}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <LockIcon sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Privacy & Security</Typography>
          </Stack>
          <Stack gap={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>Public Profile</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Other users can see you</Typography>
              </Box>
              <Switch checked={user.privacy.publicProfile} onChange={() => handleToggle('privacy', 'publicProfile')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#7c4dff' } }} />
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>Show History</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Show your previous payments</Typography>
              </Box>
              <Switch checked={user.privacy.showHistory} onChange={() => handleToggle('privacy', 'showHistory')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#7c4dff' } }} />
            </Stack>
          </Stack>
        </Paper>

        {/* Apariencia */}
        <Paper elevation={2} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: 'background.paper' }}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <PaletteIcon sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>Appearance</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1.5}>
              {isDark ? (
                <DarkModeIcon sx={{ color: 'primary.main', fontSize: 22 }} />
              ) : (
                <LightModeIcon sx={{ color: 'warning.main', fontSize: 22 }} />
              )}
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>Dark mode</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {isDark ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            </Stack>
            <Switch 
              checked={isDark} 
              onChange={toggleTheme} 
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' }, 
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#7c4dff' } 
              }} 
            />
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Stack gap={1.5} mt={2}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              height: 52,
              background: 'linear-gradient(90deg, #7c4dff, #5e35b1)',
              boxShadow: '0 4px 16px rgba(124, 77, 255, 0.4)',
              textTransform: 'none',
              '&:hover': { background: 'linear-gradient(90deg, #6a3de8, #4a2a9a)' },
            }}
            startIcon={<SaveIcon />}
          >
            Save changes
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderRadius: 3, fontWeight: 600, height: 52, color: '#7c4dff', borderColor: '#7c4dff', textTransform: 'none' }}
            startIcon={<LockIcon />}
          >
            Change password
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderRadius: 3, fontWeight: 600, height: 52, color: '#ef4444', borderColor: '#ef4444', textTransform: 'none' }}
            startIcon={<LogoutIcon />}
          >
            Log out
          </Button>
        </Stack>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </Box>
  );
};

export default PageProfile;
