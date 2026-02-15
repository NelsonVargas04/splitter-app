import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack, FlashOn, FlashOff, CameraAlt, PersonAdd, Receipt, QrCode2 } from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '@/components/BottomNavBar';
import { scanLine, glowPulse, fadeInUp, scaleIn } from '@/utils/animations';

type ScanMode = 'bill' | 'friend';

const PageQR: React.FC = () => {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState<ScanMode>('bill');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scannedBill, setScannedBill] = useState<{ total: number; items?: string[] } | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  
  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-scanner-container';

  useEffect(() => {
    startScanner();
    
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      qrReaderRef.current = new Html5Qrcode(scannerContainerId);
      
      await qrReaderRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          handleQRCodeScanned(decodedText);
        },
        () => {}
      );
      
      setIsScanning(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Could not access camera',
        severity: 'error',
      });
    }
  };

  const stopScanner = async () => {
    if (qrReaderRef.current?.isScanning) {
      try {
        await qrReaderRef.current.stop();
        setIsScanning(false);
      } catch {}
    }
  };

  const handleQRCodeScanned = (decodedText: string) => {
    if (scanMode === 'friend') {
      // Modo añadir amigo
      const friendCodeMatch = decodedText.match(/gastos-app:\/\/friend\/(\d{10})/);
      
      if (friendCodeMatch) {
        const friendCode = friendCodeMatch[1];
        setScannedCode(friendCode);
        stopScanner();
      } else if (/^\d{10}$/.test(decodedText)) {
        setScannedCode(decodedText);
        stopScanner();
      } else {
        setSnackbar({
          open: true,
          message: 'Invalid QR for adding friend',
          severity: 'error',
        });
      }
    } else {
      // Modo escanear cuenta/factura
      // Simular detección de cuenta (en producción sería parsing real)
      const total = parseFloat((Math.random() * 500 + 50).toFixed(2));
      setScannedBill({ 
        total,
        items: ['Food', 'Drinks', 'Tip']
      });
      stopScanner();
    }
  };

  const handleAddFriend = async () => {
    if (!scannedCode) return;
    
    setIsProcessing(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSnackbar({
      open: true,
      message: 'Friend request sent!',
      severity: 'success',
    });
    
    setIsProcessing(false);
    
    setTimeout(() => {
      navigate('/groups');
    }, 1500);
  };

  const handleScanAgain = () => {
    setScannedCode(null);
    setScannedBill(null);
    startScanner();
  };

  const handleModeChange = (_: React.SyntheticEvent, newValue: ScanMode) => {
    setScanMode(newValue);
    setScannedCode(null);
    setScannedBill(null);
    // Reiniciar escáner con nuevo modo
    stopScanner().then(() => startScanner());
  };

  const handleDivideBill = () => {
    if (!scannedBill) return;
    // Navegar a grupos para seleccionar con quién dividir
    navigate('/groups', { state: { billToDivide: scannedBill } });
  };

  const toggleFlash = async () => {
    if (qrReaderRef.current) {
      try {
        const track = (qrReaderRef.current as unknown as { _localMediaStream?: MediaStream })._localMediaStream?.getVideoTracks()[0];
        if (track && 'applyConstraints' in track) {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn } as MediaTrackConstraintSet],
          });
          setFlashOn(!flashOn);
        }
      } catch {}
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#000',
      }}
    >
      {/* Header compacto */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)',
          pt: 2,
          pb: 1,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} mb={2}>
          <IconButton
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
            QR Scanner
          </Typography>
          <IconButton
            sx={{ 
              bgcolor: flashOn ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255,255,255,0.1)', 
              color: flashOn ? '#ffc107' : '#fff',
            }}
            onClick={toggleFlash}
          >
            {flashOn ? <FlashOff /> : <FlashOn />}
          </IconButton>
        </Stack>

        {/* Tabs estilo Mercado Pago */}
        <Tabs
          value={scanMode}
          onChange={handleModeChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              bgcolor: '#7c4dff',
              height: 3,
            },
          }}
        >
          <Tab
            value="bill"
            icon={<Receipt sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Split bill"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 14,
              minHeight: 48,
              '&.Mui-selected': { color: '#fff' },
            }}
          />
          <Tab
            value="friend"
            icon={<PersonAdd sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Add friend"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 14,
              minHeight: 48,
              '&.Mui-selected': { color: '#fff' },
            }}
          />
        </Tabs>
      </Box>

      {/* Scanner Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          bgcolor: '#000',
        }}
      >
        {!scannedCode && !scannedBill ? (
          <>
            {/* Scanner Container */}
            <Box
              sx={{
                position: 'relative',
                width: 280,
                height: 280,
              }}
            >
              <Box
                id={scannerContainerId}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '& video': {
                    borderRadius: 3,
                  },
                }}
              />
              
              {/* Línea de escaneo animada */}
              {isScanning && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '10%',
                    width: '80%',
                    height: 3,
                    background: 'linear-gradient(90deg, transparent, #7c4dff, transparent)',
                    borderRadius: 2,
                    animation: `${scanLine} 2s ease-in-out infinite`,
                    boxShadow: '0 0 15px #7c4dff',
                  }}
                />
              )}
              
              {/* Esquinas estilo Mercado Pago con glow */}
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: 40, 
                height: 40, 
                borderTop: '4px solid #7c4dff', 
                borderLeft: '4px solid #7c4dff', 
                borderRadius: '12px 0 0 0',
                animation: `${glowPulse} 2s ease-in-out infinite`,
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                width: 40, 
                height: 40, 
                borderTop: '4px solid #7c4dff', 
                borderRight: '4px solid #7c4dff', 
                borderRadius: '0 12px 0 0',
                animation: `${glowPulse} 2s ease-in-out infinite 0.5s`,
              }} />
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: 40, 
                height: 40, 
                borderBottom: '4px solid #7c4dff', 
                borderLeft: '4px solid #7c4dff', 
                borderRadius: '0 0 0 12px',
                animation: `${glowPulse} 2s ease-in-out infinite 1s`,
              }} />
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                width: 40, 
                height: 40, 
                borderBottom: '4px solid #7c4dff', 
                borderRight: '4px solid #7c4dff', 
                borderRadius: '0 0 12px 0',
                animation: `${glowPulse} 2s ease-in-out infinite 1.5s`,
              }} />
            </Box>

            {/* Texto según modo */}
            <Typography sx={{ color: '#fff', mt: 3, textAlign: 'center', fontSize: 15, fontWeight: 500 }}>
              {scanMode === 'bill' 
                ? 'Scan the bill QR code' 
                : 'Scan your friend\'s code'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, textAlign: 'center', fontSize: 13, px: 4 }}>
              {scanMode === 'bill'
                ? 'The bill will be automatically split among your group'
                : 'They can show their personal QR from "Profile"'}
            </Typography>
          </>
        ) : scannedBill ? (
          /* Resultado: Cuenta escaneada */
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 4,
              p: 3,
              mx: 3,
              width: 'calc(100% - 48px)',
              maxWidth: 340,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: `${scaleIn} 0.4s ease-out`,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: '#f3e5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Receipt sx={{ fontSize: 36, color: '#7c4dff' }} />
            </Box>
            
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a', textAlign: 'center', mb: 1 }}>
              Bill detected!
            </Typography>
            
            <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 2, mb: 3 }}>
              <Typography sx={{ fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
                Total to split
              </Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#7c4dff', textAlign: 'center' }}>
                ${scannedBill.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
            
            <Stack spacing={1.5}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleDivideBill}
                sx={{
                  bgcolor: '#7c4dff',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#6a3de8' },
                }}
              >
                Split with my group
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={handleScanAgain}
                startIcon={<CameraAlt />}
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#6b7280',
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Scan another bill
              </Button>
            </Stack>
          </Box>
        ) : (
          /* Resultado: Amigo detectado */
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 4,
              p: 3,
              mx: 3,
              width: 'calc(100% - 48px)',
              maxWidth: 340,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: `${scaleIn} 0.4s ease-out`,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <PersonAdd sx={{ fontSize: 36, color: '#4caf50' }} />
            </Box>
            
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a', textAlign: 'center', mb: 1 }}>
              Code detected!
            </Typography>
            
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 2,
                color: '#7c4dff',
                textAlign: 'center',
                mb: 3,
              }}
            >
              {scannedCode}
            </Typography>
            
            <Stack spacing={1.5}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddFriend}
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                sx={{
                  bgcolor: '#7c4dff',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#6a3de8' },
                }}
              >
                {isProcessing ? 'Sending...' : 'Send request'}
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={handleScanAgain}
                disabled={isProcessing}
                startIcon={<CameraAlt />}
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#6b7280',
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Scan another
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      <BottomNavBar />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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

export default PageQR;
