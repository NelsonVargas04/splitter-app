import { Router, Request, Response } from 'express';
import { db, generateId } from '../db';
import { authMiddleware } from '../middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/users/me
router.get('/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    username: user.username,
    initials: user.initials,
    avatarColor: user.avatarColor,
    avatarUrl: user.avatarUrl,
    friendCode: user.friendCode,
    createdAt: user.createdAt,
  });
});

// PUT /api/users/me
router.put('/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, email, phone, username } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) {
    const emailTaken = db.users.find(u => u.email === email && u.id !== user.id);
    if (emailTaken) return res.status(409).json({ error: 'Email already in use' });
    user.email = email;
  }
  if (phone !== undefined) user.phone = phone;
  if (username !== undefined) {
    const usernameTaken = db.users.find(u => u.username === username && u.id !== user.id);
    if (usernameTaken) return res.status(409).json({ error: 'Username already in use' });
    user.username = username;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    username: user.username,
    initials: user.initials,
    avatarColor: user.avatarColor,
    avatarUrl: user.avatarUrl,
    friendCode: user.friendCode,
    createdAt: user.createdAt,
  });
});

// POST /api/users/me/avatar
router.post('/me/avatar', (req: Request, res: Response) => {
  const user = (req as any).user;
  user.avatarUrl = `https://placeholder.co/200?text=${user.initials}`;
  res.json({
    success: true,
    data: { avatarUrl: user.avatarUrl },
  });
});

// GET /api/users/me/balance
router.get('/me/balance', (req: Request, res: Response) => {
  const userId = (req as any).userId;

  let pendingToCollect = 0;
  let pendingToPay = 0;
  let thisMonthSpent = 0;
  let thisMonthEvents = 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  db.events.forEach(event => {
    const isThisMonth = new Date(event.createdAt) >= startOfMonth;

    if (event.createdById === userId) {
      event.participants.forEach(p => {
        if (p.userId !== userId && p.status === 'pending') {
          pendingToCollect += p.amount;
        }
      });
    }

    const myParticipation = event.participants.find(p => p.userId === userId);
    if (myParticipation && event.createdById !== userId && myParticipation.status === 'pending') {
      pendingToPay += myParticipation.amount;
    }

    if (myParticipation && isThisMonth) {
      thisMonthSpent += myParticipation.amount;
      thisMonthEvents++;
    }
  });

  res.json({
    pendingToCollect: Number(pendingToCollect.toFixed(2)),
    pendingToPay: Number(pendingToPay.toFixed(2)),
    thisMonthSpent: Number(thisMonthSpent.toFixed(2)),
    thisMonthEvents,
  });
});

// GET /api/users/me/stats
router.get('/me/stats', (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const friendsCount = db.friends.filter(
    f => f.userId === userId || f.friendId === userId
  ).length;

  const groupsCount = db.groups.filter(
    g => g.createdById === userId || g.members.some(m => m.id === userId)
  ).length;

  const paymentsMade = db.events.reduce((count, event) => {
    const p = event.participants.find(p => p.userId === userId && p.status === 'paid');
    return p ? count + 1 : count;
  }, 0);

  res.json({
    friendsCount,
    groupsCount,
    activeGroupsCount: groupsCount,
    paymentsMade,
  });
});

// GET /api/users/find?code=
router.get('/find', (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Code required' });

  const user = db.users.find(u => u.friendCode === code);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    initials: user.initials,
    avatarColor: user.avatarColor,
    friendCode: user.friendCode,
    createdAt: user.createdAt,
  });
});

// GET /api/users/me/payment-accounts
router.get('/me/payment-accounts', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const accounts = db.paymentAccounts.filter(a => a.userId === userId);
  res.json(accounts.map(a => ({ id: a.id, type: a.type, label: a.label, value: a.value })));
});

// POST /api/users/me/payment-accounts
router.post('/me/payment-accounts', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { type, label, value } = req.body;

  if (!type || !label || !value) {
    return res.status(400).json({ error: 'type, label, and value required' });
  }

  const account = {
    id: generateId(),
    userId,
    type,
    label,
    value,
  };

  db.paymentAccounts.push(account);
  res.status(201).json({ id: account.id, type: account.type, label: account.label, value: account.value });
});

// DELETE /api/users/me/payment-accounts/:id
router.delete('/me/payment-accounts/:id', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const accountId = parseInt(req.params.id);

  const idx = db.paymentAccounts.findIndex(a => a.id === accountId && a.userId === userId);
  if (idx === -1) return res.status(404).json({ error: 'Account not found' });

  db.paymentAccounts.splice(idx, 1);
  res.status(204).send();
});

// GET /api/users/me/notifications
router.get('/me/notifications', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  let settings = db.notificationSettings.find(s => s.userId === userId);
  if (!settings) {
    settings = { userId, push: true, email: true, sms: false, reminders: true };
    db.notificationSettings.push(settings);
  }
  res.json({ push: settings.push, email: settings.email, sms: settings.sms, reminders: settings.reminders });
});

// PUT /api/users/me/notifications
router.put('/me/notifications', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  let settings = db.notificationSettings.find(s => s.userId === userId);
  if (!settings) {
    settings = { userId, push: true, email: true, sms: false, reminders: true };
    db.notificationSettings.push(settings);
  }

  const { push, email, sms, reminders } = req.body;
  if (push !== undefined) settings.push = push;
  if (email !== undefined) settings.email = email;
  if (sms !== undefined) settings.sms = sms;
  if (reminders !== undefined) settings.reminders = reminders;

  res.json({ push: settings.push, email: settings.email, sms: settings.sms, reminders: settings.reminders });
});

// GET /api/users/me/privacy
router.get('/me/privacy', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  let settings = db.privacySettings.find(s => s.userId === userId);
  if (!settings) {
    settings = { userId, publicProfile: true, showHistory: false };
    db.privacySettings.push(settings);
  }
  res.json({ publicProfile: settings.publicProfile, showHistory: settings.showHistory });
});

// PUT /api/users/me/privacy
router.put('/me/privacy', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  let settings = db.privacySettings.find(s => s.userId === userId);
  if (!settings) {
    settings = { userId, publicProfile: true, showHistory: false };
    db.privacySettings.push(settings);
  }

  const { publicProfile, showHistory } = req.body;
  if (publicProfile !== undefined) settings.publicProfile = publicProfile;
  if (showHistory !== undefined) settings.showHistory = showHistory;

  res.json({ publicProfile: settings.publicProfile, showHistory: settings.showHistory });
});

export default router;
