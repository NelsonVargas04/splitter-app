import { Router, Request, Response } from 'express';
import { db, generateId, getInitials, getAvatarColor } from '../db';
import { authMiddleware } from '../middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/friends
router.get('/', (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const friendRecords = db.friends.filter(f => f.userId === userId || f.friendId === userId);

  const friends = friendRecords.map(fr => {
    const friendUserId = fr.userId === userId ? fr.friendId : fr.userId;
    const friendUser = db.users.find(u => u.id === friendUserId);

    if (!friendUser) {
      return {
        id: fr.id,
        name: 'Unknown',
        initials: 'UN',
        avatarColor: '#999',
        friendCode: '',
        addedAt: fr.addedAt,
      };
    }

    return {
      id: fr.id,
      name: friendUser.name,
      initials: friendUser.initials,
      avatarColor: friendUser.avatarColor,
      email: friendUser.email,
      phone: friendUser.phone,
      friendCode: friendUser.friendCode,
      addedAt: fr.addedAt,
    };
  });

  res.json(friends);
});

// POST /api/friends
router.post('/', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name, initials, avatarColor, email, phone, friendCode } = req.body;

  const friend = {
    id: generateId(),
    userId,
    friendId: generateId(),
    addedAt: new Date(),
  };

  db.friends.push(friend);

  res.status(201).json({
    id: friend.id,
    name: name || 'Friend',
    initials: initials || getInitials(name || 'Friend'),
    avatarColor: avatarColor || getAvatarColor(name || 'Friend'),
    email,
    phone,
    friendCode: friendCode || '',
    addedAt: friend.addedAt,
  });
});

// DELETE /api/friends/:id
router.delete('/:id', (req: Request, res: Response) => {
  const friendRecordId = parseInt(req.params.id);
  const idx = db.friends.findIndex(f => f.id === friendRecordId);
  if (idx === -1) return res.status(404).json({ error: 'Friend not found' });

  db.friends.splice(idx, 1);
  res.status(204).send();
});

// POST /api/friends/request
router.post('/request', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { friendCode } = req.body;

  if (!friendCode) {
    return res.status(400).json({ success: false, message: 'Friend code required' });
  }

  const targetUser = db.users.find(u => u.friendCode === friendCode);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User not found with that code' });
  }

  if (targetUser.id === userId) {
    return res.status(400).json({ success: false, message: 'Cannot send request to yourself' });
  }

  const existingRequest = db.friendRequests.find(
    r => r.fromUserId === userId && r.toUserId === targetUser.id && r.status === 'pending'
  );
  if (existingRequest) {
    return res.status(409).json({ success: false, message: 'Request already sent' });
  }

  const alreadyFriends = db.friends.some(
    f => (f.userId === userId && f.friendId === targetUser.id) ||
         (f.userId === targetUser.id && f.friendId === userId)
  );
  if (alreadyFriends) {
    return res.status(409).json({ success: false, message: 'Already friends' });
  }

  const request = {
    id: generateId(),
    fromUserId: userId,
    toUserId: targetUser.id,
    status: 'pending' as const,
    createdAt: new Date(),
  };

  db.friendRequests.push(request);
  res.status(201).json({ success: true, message: 'Friend request sent!' });
});

// GET /api/friends/requests
router.get('/requests', (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const requests = db.friendRequests
    .filter(r => r.toUserId === userId || r.fromUserId === userId)
    .map(r => {
      const fromUser = db.users.find(u => u.id === r.fromUserId);
      return {
        id: r.id,
        fromUserId: r.fromUserId,
        fromUserName: fromUser?.name || 'Unknown',
        fromUserInitials: fromUser?.initials || 'UN',
        fromUserAvatarColor: fromUser?.avatarColor,
        toUserId: r.toUserId,
        status: r.status,
        createdAt: r.createdAt,
      };
    });

  res.json(requests);
});

// PUT /api/friends/requests/:id
router.put('/requests/:id', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const requestId = parseInt(req.params.id);
  const { accept } = req.body;

  const request = db.friendRequests.find(r => r.id === requestId && r.toUserId === userId);
  if (!request) return res.status(404).json({ error: 'Friend request not found' });

  if (request.status !== 'pending') {
    return res.status(400).json({ error: 'Request already processed' });
  }

  if (accept) {
    request.status = 'accepted';

    db.friends.push({
      id: generateId(),
      userId: request.fromUserId,
      friendId: request.toUserId,
      addedAt: new Date(),
    });

    res.json({ success: true, message: 'Friend added!' });
  } else {
    request.status = 'rejected';
    res.json({ success: true, message: 'Request rejected' });
  }
});

export default router;
