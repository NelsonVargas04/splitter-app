import React from 'react';
import { Box, Typography, Stack, IconButton, LinearProgress, Button, Avatar, Card, CardContent, Divider } from '@mui/material';
import { ArrowBack, MoreVert, Notifications, Restaurant, People, CheckCircle, AccessTime } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavBar from '@/components/BottomNavBar';
import { fadeInUp, getStaggerDelay } from '@/utils/animations';

// Mock data - esto vendría de una API basado en el ID del evento
const eventData = {
  id: 1,
  name: 'Dinner at Carlitos',
  createdAt: '1 hour ago',
  peopleCount: 5,
};

const summaryData = {
  collected: 375,
  total: 625,
  paid: 3,
  pending: 2,
  remaining: 250,
};

const participants = [
  { id: 1, name: 'Juan Pérez', initials: 'JP', status: 'paid', method: 'Mercado Pago', time: '18:45', amount: 125, avatarColor: '#7c4dff' },
  { id: 2, name: 'María García', initials: 'MG', status: 'paid', method: 'Mercado Pago', time: '18:46', amount: 125, avatarColor: '#4ecdc4' },
  { id: 3, name: 'Carlos López', initials: 'CL', status: 'pending', method: 'Manual', time: null, amount: 125, avatarColor: '#ff6b6b' },
  { id: 4, name: 'Ana Martínez', initials: 'AM', status: 'paid', method: 'Mercado Pago', time: '18:50', amount: 125, avatarColor: '#45b7d1' },
  { id: 5, name: 'Pedro Ruiz', initials: 'PR', status: 'pending', method: 'Mercado Pago', time: null, amount: 125, avatarColor: '#96ceb4' },
];

const PageEventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const progress = (summaryData.collected / summaryData.total) * 100;
  const pendingCount = participants.filter(p => p.status === 'pending').length;

  // En una app real, aquí cargarías los datos del evento usando el ID
  console.log('Event ID:', id);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)', p: 2, pb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            <MoreVert />
          </IconButton>
        </Stack>

        {/* Event Title */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: '#7c4dff', width: 56, height: 56 }}>
            <Restaurant sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>{eventData.name}</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
              <People sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {eventData.peopleCount} people · {eventData.createdAt}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, pb: 18 }}>
        {/* Summary Card */}
        <Card sx={{ 
          borderRadius: 3, 
          mb: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          animation: `${fadeInUp} 0.5s ease-out`,
        }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Collected
            </Typography>
            <Typography sx={{ fontSize: 34, fontWeight: 700, color: 'text.primary' }}>
              ${summaryData.collected}
            </Typography>
            <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 2 }}>
              de ${summaryData.total} total
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'action.disabledBackground',
                mb: 2.5,
                '& .MuiLinearProgress-bar': { 
                  bgcolor: 'primary.main', 
                  borderRadius: 4 
                },
              }}
            />

            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'success.main' }}>{summaryData.paid}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Paid</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'warning.main' }}>{summaryData.pending}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Pending</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'text.primary' }}>${summaryData.remaining}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Remaining</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Participants Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>Participants</Typography>
          <Typography sx={{ fontSize: 14, color: 'primary.main', fontWeight: 500 }}>View all</Typography>
        </Stack>

        {/* Participant List */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          animation: `${fadeInUp} 0.5s ease-out 0.1s both`,
        }}>
          {participants.map((p, index) => (
            <Box key={p.id}>
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                animation: `${fadeInUp} 0.4s ease-out ${getStaggerDelay(index, 0.08)} both`,
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}>
                <Avatar sx={{ bgcolor: p.avatarColor, width: 44, height: 44, fontSize: 15, fontWeight: 600 }}>
                  {p.initials}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 15, color: 'text.primary' }}>{p.name}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {p.status === 'paid' ? (
                      <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                    ) : (
                      <AccessTime sx={{ fontSize: 14, color: 'warning.main' }} />
                    )}
                    <Typography sx={{ fontSize: 13, color: p.status === 'paid' ? 'success.main' : 'warning.main' }}>
                      {p.status === 'paid' ? `Paid at ${p.time}` : 'Pending'}
                    </Typography>
                  </Stack>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 17, color: 'text.primary' }}>${p.amount}</Typography>
              </Box>
              {index < participants.length - 1 && <Divider />}
            </Box>
          ))}
        </Card>
      </Box>

      {/* Fixed Bottom Button */}
      {pendingCount > 0 && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 70, 
          left: 16, 
          right: 16, 
          zIndex: 100,
          animation: `${fadeInUp} 0.5s ease-out 0.3s both`,
        }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Notifications />}
            sx={{
              height: 52,
              borderRadius: 3,
              bgcolor: 'primary.main',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 15,
              boxShadow: '0 4px 12px rgba(124, 77, 255, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { 
                bgcolor: 'primary.dark',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Remind {pendingCount} pending
          </Button>
        </Box>
      )}

      <BottomNavBar />
    </Box>
  );
};

export default PageEventDetail;
