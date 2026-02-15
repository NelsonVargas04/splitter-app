import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: register logic
    }, 1800);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)' }}>
      <Box sx={{ p: 3 }}>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Nelson Vargas</Typography>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, pb: 8 }}>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 28, textAlign: 'center', mb: 6 }}>Register</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField fullWidth placeholder="First name" name="firstName" variant="outlined" sx={inputStyles} />
          <TextField fullWidth placeholder="Last name" name="lastName" variant="outlined" sx={inputStyles} />
          <TextField fullWidth placeholder="Email" name="email" type="email" variant="outlined" sx={inputStyles} />
          <TextField fullWidth placeholder="Password" name="password" type="password" variant="outlined" sx={inputStyles} />
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 1, width: '100%', height: 52, borderRadius: 8, background: 'linear-gradient(90deg, #7c4dff, #5e35b1)', textTransform: 'none', fontWeight: 600, fontSize: 16, '&:hover': { background: 'linear-gradient(90deg, #6a3de8, #4a2a9a)' } }}>
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PageRegister;