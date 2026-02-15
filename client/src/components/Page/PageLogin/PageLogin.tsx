import React, { useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/verify');
    }, 1800);
  };

  const handleGuestLogin = () => {
    // TODO: login como invitado
  };

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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, width: '100%' }}
    >
      <TextField
        fullWidth
        placeholder="Username"
        name="username"
        autoComplete="username"
        variant="outlined"
        sx={inputStyles}
      />

      <TextField
        fullWidth
        placeholder="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        variant="outlined"
        sx={inputStyles}
      />

      {/* Recordar usuario */}
      <FormControlLabel
        control={<Checkbox sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#7c4dff' } }} />}
        label="Remember me"
        sx={{ alignSelf: 'flex-start', color: 'rgba(255,255,255,0.7)', ml: -0.5 }}
      />

      {/* Botón Ingresar */}
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          mt: 1,
          width: '100%',
          height: 52,
          borderRadius: 8,
          background: 'linear-gradient(90deg, #7c4dff, #5e35b1)',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 16,
          '&:hover': { background: 'linear-gradient(90deg, #6a3de8, #4a2a9a)' },
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
      </Button>

      {/* Link invitado */}
      <Link
        component="button"
        type="button"
        onClick={handleGuestLogin}
        sx={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          textDecoration: 'none',
          cursor: 'pointer',
          '&:hover': { color: '#fff', textDecoration: 'underline' },
        }}
      >
        Sign in as guest
      </Link>

      {/* Link registro */}
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mt: 2 }}>
        Don't have an account?{' '}
        <Link
          href="/register"
          sx={{
            color: '#7c4dff',
            textDecoration: 'none',
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Register
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
