import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { ContentCopy, PersonAdd, QrCode2, Tag } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import useStoreTheme from '@/stores/StoreTheme';

interface AddFriendProps {
  myFriendCode: string;
  onSendRequest: (code: string) => Promise<{ success: boolean; message: string }>;
}

const AddFriend: React.FC<AddFriendProps> = ({
  myFriendCode,
  onSendRequest,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'code' | 'qr'>('code');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const { mode: themeMode } = useStoreTheme();
  const isDark = themeMode === 'dark';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(myFriendCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to copy code',
        severity: 'error',
      });
    }
  };

  const handleSendRequest = async () => {
    if (!inputCode.trim()) {
      setSnackbar({
        open: true,
        message: 'Enter a friend code',
        severity: 'error',
      });
      return;
    }

    if (inputCode.trim() === myFriendCode) {
      setSnackbar({
        open: true,
        message: 'You cannot add yourself',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSendRequest(inputCode.trim());
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'error',
      });
      if (result.success) {
        setInputCode('');
      }
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to send request',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'code' | 'qr' | null) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const qrValue = `gastos-app://friend/${myFriendCode}`;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 2.5,
        mb: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header con Toggle */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'primary.main' }}>
          Add friend
        </Typography>
        
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: 1,
              borderColor: 'divider',
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 12,
              px: 1.5,
              py: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: '#fff',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            },
            '& .MuiToggleButton-root:first-of-type': {
              borderRadius: '8px 0 0 8px',
            },
            '& .MuiToggleButton-root:last-of-type': {
              borderRadius: '0 8px 8px 0',
            },
          }}
        >
          <ToggleButton value="code">
            <Tag sx={{ fontSize: 16, mr: 0.5 }} />
            Code
          </ToggleButton>
          <ToggleButton value="qr">
            <QrCode2 sx={{ fontSize: 16, mr: 0.5 }} />
            QR
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Modo QR */}
      {mode === 'qr' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 3,
          }}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              p: 2,
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              mb: 2,
            }}
          >
            <QRCodeSVG
              value={qrValue}
              size={160}
              level="M"
              bgColor="#ffffff"
              fgColor="#1a1a1a"
            />
          </Box>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 0.5 }}>
            Ask your friend to scan this QR
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: 14,
              color: 'text.disabled',
              letterSpacing: 1,
            }}
          >
            {myFriendCode}
          </Typography>
        </Box>
      )}

      {/* Modo Código */}
      {mode === 'code' && (
        <>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mb: 1 }}>
            Your friend code
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
            <Box
              sx={{
                flex: 1,
                bgcolor: 'action.hover',
                borderRadius: 2,
                p: 1.5,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: 2,
                  fontFamily: 'monospace',
                }}
              >
                {myFriendCode}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleCopyCode}
              startIcon={<ContentCopy sx={{ fontSize: 18 }} />}
              sx={{
                bgcolor: copied ? 'success.main' : 'primary.main',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                py: 1.25,
                borderRadius: 2,
                minWidth: 100,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: copied ? 'success.dark' : 'primary.dark',
                  boxShadow: 'none',
                },
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ color: 'text.secondary', fontSize: 13, mb: 1.5 }}>
            Send friend request
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              fullWidth
              size="small"
              placeholder="10-digit code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.disabled',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              inputProps={{
                style: { fontFamily: 'monospace', letterSpacing: 1 },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleSendRequest}
              disabled={isLoading || !inputCode.trim()}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <PersonAdd sx={{ fontSize: 18 }} />}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                py: 0.875,
                borderRadius: 2,
                minWidth: 100,
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'action.hover',
                },
                '&:disabled': {
                  borderColor: 'divider',
                  color: 'text.disabled',
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddFriend;