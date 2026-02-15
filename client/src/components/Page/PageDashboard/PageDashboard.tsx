import React from 'react';
import { Box, Typography, Stack, IconButton, Card, CardContent, Divider, Avatar, Chip } from '@mui/material';
import { 
  Notifications, 
  TrendingUp, 
  TrendingDown,
  Restaurant,
  SportsSoccer,
  ShoppingBag,
  Flight,
  ChevronRight,
  AccountBalanceWallet,
  Receipt,
  Groups,
  WavingHand,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '@/components/BottomNavBar';
import { fadeInUp, getStaggerDelay } from '@/utils/animations';

// Mock data - Resumen general del usuario
const userSummary = {
  name: 'Juan',
  totalSpent: 2450,
  thisMonth: 850,
  pendingToCollect: 375, // Owed to you
  pendingToPay: 125, // You owe
};

// Eventos recientes
const recentEvents = [
  { 
    id: 1, 
    name: 'Dinner at Carlitos', 
    icon: 'restaurant',
    iconBgColor: '#7c4dff',
    date: '1 hour ago',
    total: 625,
    myShare: 125,
    status: 'pending', // pending, settled
    participants: 5,
    pendingCount: 2,
  },
  { 
    id: 2, 
    name: '5-a-side Soccer - Saturday', 
    icon: 'sports',
    iconBgColor: '#4caf50',
    date: '2 days ago',
    total: 800,
    myShare: 100,
    status: 'settled',
    participants: 8,
    pendingCount: 0,
  },
  { 
    id: 3, 
    name: 'Shared groceries', 
    icon: 'shopping',
    iconBgColor: '#ff9800',
    date: '1 week ago',
    total: 1200,
    myShare: 400,
    status: 'settled',
    participants: 3,
    pendingCount: 0,
  },
  { 
    id: 4, 
    name: 'Trip to Mendoza', 
    icon: 'flight',
    iconBgColor: '#e91e63',
    date: '2 weeks ago',
    total: 15000,
    myShare: 3750,
    status: 'pending',
    participants: 4,
    pendingCount: 1,
  },
];

const getEventIcon = (iconType: string) => {
  switch (iconType) {
    case 'restaurant': return <Restaurant />;
    case 'sports': return <SportsSoccer />;
    case 'shopping': return <ShoppingBag />;
    case 'flight': return <Flight />;
    default: return <Receipt />;
  }
};

const PageDashboard: React.FC = () => {
  const navigate = useNavigate();
  const pendingEvents = recentEvents.filter(e => e.status === 'pending').length;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1025 100%)', p: 2, pb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>
              Hi, {userSummary.name} <WavingHand sx={{ fontSize: 24, color: '#ffca28', verticalAlign: 'middle' }} />
            </Typography>
          </Box>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            <Notifications />
          </IconButton>
        </Stack>

        {/* Balance Cards */}
        <Stack direction="row" spacing={2}>
          <Card sx={{ 
            flex: 1, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <TrendingUp sx={{ color: '#4caf50', fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  Owed to you
                </Typography>
              </Stack>
              <Typography sx={{ color: '#4caf50', fontWeight: 700, fontSize: 22 }}>
                ${userSummary.pendingToCollect.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            flex: 1, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <TrendingDown sx={{ color: '#ff9800', fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  You owe
                </Typography>
              </Stack>
              <Typography sx={{ color: '#ff9800', fontWeight: 700, fontSize: 22 }}>
                ${userSummary.pendingToPay.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, pb: 12, mt: -2 }}>
        {/* Monthly Summary Card */}
        <Card sx={{ 
          borderRadius: 3, 
          mb: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          animation: `${fadeInUp} 0.5s ease-out`,
        }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                <AccountBalanceWallet sx={{ fontSize: 20 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  Spent this month
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 24, color: 'text.primary' }}>
                  ${userSummary.thisMonth.toLocaleString()}
                </Typography>
              </Box>
              <Chip 
                label={`${pendingEvents} pending`}
                size="small"
                sx={{ 
                  bgcolor: pendingEvents > 0 ? 'warning.light' : 'success.light',
                  color: pendingEvents > 0 ? 'warning.dark' : 'success.dark',
                  fontWeight: 600,
                }}
              />
            </Stack>
            
            <Divider sx={{ my: 2 }} />
            
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary' }}>
                  {recentEvents.length}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Events</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary' }}>
                  12
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Friends</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary' }}>
                  3
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Groups</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Recent Events Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Receipt sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
              Recent events
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 14, color: 'primary.main', fontWeight: 500, cursor: 'pointer' }}>
            View all
          </Typography>
        </Stack>

        {/* Events List */}
        <Stack spacing={1.5}>
          {recentEvents.map((event, index) => (
            <Card 
              key={event.id}
              onClick={() => navigate(`/event/${event.id}`)}
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                animation: `${fadeInUp} 0.4s ease-out ${getStaggerDelay(index, 0.1)} both`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: event.iconBgColor, width: 48, height: 48 }}>
                    {getEventIcon(event.icon)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography sx={{ fontWeight: 600, fontSize: 15, color: 'text.primary' }}>
                        {event.name}
                      </Typography>
                      <ChevronRight sx={{ color: 'text.disabled', fontSize: 20 }} />
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                      <Groups sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {event.participants} people · {event.date}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                        Your share: <strong style={{ color: 'inherit' }}>${event.myShare}</strong>
                      </Typography>
                      {event.status === 'pending' ? (
                        <Chip 
                          label={`${event.pendingCount} pending`}
                          size="small"
                          sx={{ 
                            bgcolor: 'warning.light', 
                            color: 'warning.dark',
                            fontSize: 11,
                            height: 22,
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Chip 
                          label="Completed"
                          size="small"
                          sx={{ 
                            bgcolor: 'success.light', 
                            color: 'success.dark',
                            fontSize: 11,
                            height: 22,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      <BottomNavBar />
    </Box>
  );
};

export default PageDashboard;