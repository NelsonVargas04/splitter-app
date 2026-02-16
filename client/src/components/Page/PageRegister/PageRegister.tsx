import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useStoreAuth from '@/stores/StoreAuth';

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 52,
    '& fieldset': { border: 'none' },
    '& input': {
      color: '#333',
      fontSize: 16,
      '&::placeholder': { color: '#999', opacity: 1 },
    },
  },
};

const PageRegister: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading: loading, error } = useStoreAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(firstName, lastName, email, password);
    if (success) {
      navigate('/verify');
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)' }}>
      <Box sx={{ p: 3 }}>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Nelson Vargas</Typography>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, pb: 8 }}>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 28, textAlign: 'center', mb: 6 }}>Register</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          )}
          <TextField fullWidth placeholder="First name" name="firstName" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={inputStyles} />
          <TextField fullWidth placeholder="Last name" name="lastName" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} sx={inputStyles} />
          <TextField fullWidth placeholder="Email" name="email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={inputStyles} />
          <TextField fullWidth placeholder="Password" name="password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} sx={inputStyles} />
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 1, width: '100%', height: 52, borderRadius: 8, background: 'linear-gradient(90deg, #7c4dff, #5e35b1)', textTransform: 'none', fontWeight: 600, fontSize: 16, '&:hover': { background: 'linear-gradient(90deg, #6a3de8, #4a2a9a)' } }}>
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PageRegister;