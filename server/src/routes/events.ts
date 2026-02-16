import { Router, Request, Response } from 'express';
import { db, generateId } from '../db';
import { authMiddleware } from '../middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/events/recent?limit=10
router.get('/recent', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const limit = parseInt(req.query.limit as string) || 10;

  const userEvents = db.events
    .filter(
      e => e.createdById === userId || e.participants.some(p => p.userId === userId)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  const eventsWithDetails = userEvents.map(event => {
    const group = event.groupId ? db.groups.find(g => g.id === event.groupId) : null;
    const myParticipation = event.participants.find(p => p.userId === userId);

    return {
      id: event.id,
      name: event.name,
      icon: event.icon,
      iconBgColor: event.iconBgColor,
      groupId: event.groupId,
      groupName: group?.name || null,
      total: event.total,
      myShare: myParticipation?.amount || 0,
      status: event.status,
      participantCount: event.participants.length,
      participants: event.participants.map(p => {
        const pUser = db.users.find(u => u.id === p.userId);
        return {
          id: p.id,
          userId: p.userId,
          name: pUser?.name || 'Unknown',
          initials: pUser?.initials || 'UN',
          avatarColor: pUser?.avatarColor,
          amount: p.amount,
          status: p.status,
          paymentMethod: p.paymentMethod,
          paidAt: p.paidAt,
        };
      }),
      createdById: event.createdById,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  });

  res.json(eventsWithDetails);
});

// GET /api/events/:id
router.get('/:id', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const group = event.groupId ? db.groups.find(g => g.id === event.groupId) : null;

  const eventWithDetails = {
    id: event.id,
    name: event.name,
    icon: event.icon,
    iconBgColor: event.iconBgColor,
    groupId: event.groupId,
    groupName: group?.name || null,
    total: event.total,
    myShare: 0,
    status: event.status,
    participantCount: event.participants.length,
    participants: event.participants.map(p => {
      const pUser = db.users.find(u => u.id === p.userId);
      return {
        id: p.id,
        userId: p.userId,
        name: pUser?.name || 'Unknown',
        initials: pUser?.initials || 'UN',
        avatarColor: pUser?.avatarColor,
        amount: p.amount,
        status: p.status,
        paymentMethod: p.paymentMethod,
        paidAt: p.paidAt,
      };
    }),
    createdById: event.createdById,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };

  res.json(eventWithDetails);
});

// GET /api/events/:id/summary
router.get('/:id/summary', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const paidParticipants = event.participants.filter(p => p.status === 'paid');
  const pendingParticipants = event.participants.filter(p => p.status === 'pending');
  const collected = paidParticipants.reduce((sum, p) => sum + p.amount, 0);

  res.json({
    collected: Number(collected.toFixed(2)),
    total: event.total,
    paidCount: paidParticipants.length,
    pendingCount: pendingParticipants.length,
    remainingCount: pendingParticipants.length,
  });
});

// GET /api/events/:id/participants
router.get('/:id/participants', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const participants = event.participants.map(p => {
    const pUser = db.users.find(u => u.id === p.userId);
    return {
      id: p.id,
      userId: p.userId,
      name: pUser?.name || 'Unknown',
      initials: pUser?.initials || 'UN',
      avatarColor: pUser?.avatarColor,
      amount: p.amount,
      status: p.status,
      paymentMethod: p.paymentMethod,
      paidAt: p.paidAt,
    };
  });

  res.json(participants);
});

// POST /api/events
router.post('/', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name, icon, iconBgColor, groupId, total, participantIds } = req.body;

  if (!name || !total || !participantIds || !Array.isArray(participantIds)) {
    return res.status(400).json({ error: 'name, total, and participantIds required' });
  }

  const allParticipantIds = participantIds.includes(userId)
    ? participantIds
    : [userId, ...participantIds];

  const share = Number((total / allParticipantIds.length).toFixed(2));

  const participants = allParticipantIds.map((pid: number) => ({
    id: generateId(),
    userId: pid,
    amount: share,
    status: pid === userId ? ('paid' as const) : ('pending' as const),
    paymentMethod: '',
    paidAt: pid === userId ? new Date() : null,
  }));

  const event = {
    id: generateId(),
    name,
    icon: icon || 'restaurant',
    iconBgColor: iconBgColor || '#7c4dff',
    groupId: groupId || null,
    total: Number(total),
    createdById: userId,
    participants,
    status: 'pending' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.events.push(event);
  res.status(201).json(event);
});

// PUT /api/events/:id
router.put('/:id', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const { name, icon, iconBgColor, total } = req.body;
  if (name !== undefined) event.name = name;
  if (icon !== undefined) event.icon = icon;
  if (iconBgColor !== undefined) event.iconBgColor = iconBgColor;
  if (total !== undefined) event.total = Number(total);
  event.updatedAt = new Date();

  res.json(event);
});

// DELETE /api/events/:id
router.delete('/:id', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const idx = db.events.findIndex(e => e.id === eventId);
  if (idx === -1) return res.status(404).json({ error: 'Event not found' });

  db.events.splice(idx, 1);
  res.status(204).send();
});

// POST /api/events/:id/remind
router.post('/:id/remind', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const pendingParticipants = event.participants.filter(p => p.status === 'pending');

  console.log(`[Events] Reminder sent for event "${event.name}" to ${pendingParticipants.length} participants`);

  res.json({
    success: true,
    message: `Reminder sent to ${pendingParticipants.length} pending participants`,
  });
});

// PUT /api/events/:id/participants/:participantId/pay
router.put('/:id/participants/:participantId/pay', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const participantId = parseInt(req.params.participantId);

  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const participant = event.participants.find(p => p.id === participantId);
  if (!participant) return res.status(404).json({ error: 'Participant not found' });

  participant.status = 'paid';
  participant.paidAt = new Date();
  event.updatedAt = new Date();

  const allPaid = event.participants.every(p => p.status === 'paid');
  if (allPaid) {
    event.status = 'settled';
  }

  const pUser = db.users.find(u => u.id === participant.userId);
  res.json({
    id: participant.id,
    userId: participant.userId,
    name: pUser?.name || 'Unknown',
    initials: pUser?.initials || 'UN',
    avatarColor: pUser?.avatarColor,
    amount: participant.amount,
    status: participant.status,
    paymentMethod: participant.paymentMethod,
    paidAt: participant.paidAt,
  });
});

// PUT /api/events/:id/settle
router.put('/:id/settle', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  event.status = 'settled';
  event.participants.forEach(p => {
    if (p.status === 'pending') {
      p.status = 'paid';
      p.paidAt = new Date();
    }
  });
  event.updatedAt = new Date();

  res.json(event);
});

export default router;
