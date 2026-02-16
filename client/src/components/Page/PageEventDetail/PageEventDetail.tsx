import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, IconButton, LinearProgress, Button, Avatar, Card, CardContent, Divider, CircularProgress } from '@mui/material';
import { ArrowBack, MoreVert, Notifications, Restaurant, People, CheckCircle, AccessTime, SportsSoccer, ShoppingBag, Flight, Receipt } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavBar from '@/components/BottomNavBar';
import { fadeInUp, getStaggerDelay } from '@/utils/animations';
import ServiceEvents from '@/services/ServiceEvents';
import { Event as AppEvent, EventSummary } from '@/models/domain';

const getEventIconComponent = (iconType: string) => {
  switch (iconType) {
    case 'restaurant': return <Restaurant sx={{ fontSize: 28 }} />;
    case 'sports_soccer': return <SportsSoccer sx={{ fontSize: 28 }} />;
    case 'shopping': return <ShoppingBag sx={{ fontSize: 28 }} />;
    case 'flight': return <Flight sx={{ fontSize: 28 }} />;
    default: return <Receipt sx={{ fontSize: 28 }} />;
  }
};

const PageEventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [summary, setSummary] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [reminding, setReminding] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadEvent = async () => {
      setLoading(true);
      try {
        const [eventData, summaryData] = await Promise.all([
          ServiceEvents.fetchEvent(parseInt(id)),
          ServiceEvents.fetchEventSummary(parseInt(id)),
        ]);
        setEvent(eventData);
        setSummary(summaryData);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  const handleRemind = async () => {
    if (!id) return;
    setReminding(true);
    try {
      await ServiceEvents.remindPending(parseInt(id));
    } finally {
      setReminding(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event || !summary) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Typography>Event not found</Typography>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </Box>
    );
  }

  const progress = (summary.collected / summary.total) * 100;
  const pendingCount = event.participants.filter(p => p.status === 'pending').length;
  const remaining = summary.total - summary.collected;

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
          <Avatar sx={{ bgcolor: event.iconBgColor || '#7c4dff', width: 56, height: 56 }}>
            {getEventIconComponent(event.icon)}
          </Avatar>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>{event.name}</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
              <People sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {event.participantCount} people
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
              ${summary.collected}
            </Typography>
            <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 2 }}>
              de ${summary.total} total
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
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'success.main' }}>{summary.paidCount}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Paid</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'warning.main' }}>{summary.pendingCount}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Pending</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'text.primary' }}>${remaining}</Typography>
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
          {event.participants.map((p, index) => (
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
                <Avatar sx={{ bgcolor: p.avatarColor || '#7c4dff', width: 44, height: 44, fontSize: 15, fontWeight: 600 }}>
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
                      {p.status === 'paid' ? 'Paid' : 'Pending'}
                    </Typography>
                  </Stack>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 17, color: 'text.primary' }}>${p.amount}</Typography>
              </Box>
              {index < event.participants.length - 1 && <Divider />}
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
            startIcon={reminding ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <Notifications />}
            disabled={reminding}
            onClick={handleRemind}
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
