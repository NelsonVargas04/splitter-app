import React, { useState } from 'react'
import { Box, TextField, Button, Link, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useStoreAuth from '@/stores/StoreAuth'

const RESEND_SECONDS = 30

const PageVerifyForm: React.FC = () => {
  const [code, setCode] = useState('')
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS)
  const [showToast, setShowToast] = useState(false)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const navigate = useNavigate()
  const { verify, resendCode, isLoading: loading, error } = useStoreAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await verify(code)
    if (success) {
      navigate('/dashboard')
    }
  }

  const handleResend = async () => {
    setResendDisabled(true)
    const success = await resendCode()
    if (success) {
      setShowToast(true)
    }
    setResendTimer(RESEND_SECONDS)
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setResendDisabled(false)
          return RESEND_SECONDS
        }
        return prev - 1
      })
    }, 1000)
  }

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

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
  }

  return (
    <>
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Your code was sent
        </Alert>
      </Snackbar>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, width: '100%' }}
      >
        {error && (
          <Alert severity="error" sx={{ width: '100%', borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          placeholder="Verification code"
          name="code"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={inputStyles}
        />

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
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Continue'}
        </Button>

        <Link
          component="button"
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          sx={{
            color: resendDisabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
            fontSize: 14,
            textDecoration: 'none',
            cursor: resendDisabled ? 'not-allowed' : 'pointer',
            '&:hover': { color: resendDisabled ? 'rgba(255,255,255,0.3)' : '#fff', textDecoration: 'underline' },
          }}
        >
          {resendDisabled ? `Resend code (${resendTimer}s)` : 'Resend code'}
        </Link>
      </Box>
    </>
  )
}

export default PageVerifyForm
