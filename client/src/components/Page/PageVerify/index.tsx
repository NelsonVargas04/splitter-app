import React from 'react'
import { Box, Typography } from '@mui/material'
import PageVerifyForm from './PageVerify'
import UxIcon from '@/components/UxIcon'

const PageVerify: React.FC = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <UxIcon size={32} />
        <Typography sx={{ color: '#7c4dff', fontWeight: 700, fontSize: 22, letterSpacing: 0.5, ml: 1, fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif', userSelect: 'none' }}>
          SplitApp
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, pb: 8 }}>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 28, textAlign: 'center', mb: 6 }}>Verificación</Typography>
        <Box sx={{ width: '100%', maxWidth: 340 }}>
          <PageVerifyForm />
        </Box>
      </Box>
    </Box>
  )
}

export default PageVerify
