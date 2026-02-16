import { Router, Request, Response } from 'express';
import { db, generateId, getInitials, getAvatarColor } from '../db';
import { authMiddleware } from '../middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/groups
router.get('/', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const groups = db.groups.filter(
    g => g.createdById === userId || g.members.some(m => m.id === userId)
  );
  res.json(groups);
});

// GET /api/groups/:id
router.get('/:id', (req: Request, res: Response) => {
  const groupId = parseInt(req.params.id);
  const group = db.groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  res.json(group);
});

// POST /api/groups
router.post('/', (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const user = (req as any).user;
  const { name, icon, iconBgColor, members } = req.body;

  if (!name) return res.status(400).json({ error: 'Group name required' });

  const memberObjects = (members || []).map((m: any) => {
    if (typeof m === 'number') {
      const friendUser = db.users.find(u => u.id === m);
      if (friendUser) {
        return {
          id: friendUser.id,
          name: friendUser.name,
          initials: friendUser.initials,
          avatarColor: friendUser.avatarColor,
        };
      }
      return { id: m, name: 'Member', initials: 'M', avatarColor: '#7c4dff' };
    }
    return m;
  });

  const creatorInMembers = memberObjects.some((m: any) => m.id === userId);
  if (!creatorInMembers) {
    memberObjects.unshift({
      id: user.id,
      name: user.name,
      initials: user.initials,
      avatarColor: user.avatarColor,
    });
  }

  const group = {
    id: generateId(),
    name,
    icon: icon || 'celebration',
    iconBgColor: iconBgColor || '#7c4dff',
    createdById: userId,
    members: memberObjects,
    createdAt: new Date(),
  };

  db.groups.push(group);
  res.status(201).json(group);
});

// PUT /api/groups/:id
router.put('/:id', (req: Request, res: Response) => {
  const groupId = parseInt(req.params.id);
  const group = db.groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const { name, icon, iconBgColor } = req.body;
  if (name !== undefined) group.name = name;
  if (icon !== undefined) group.icon = icon;
  if (iconBgColor !== undefined) group.iconBgColor = iconBgColor;

  res.json(group);
});

// DELETE /api/groups/:id
router.delete('/:id', (req: Request, res: Response) => {
  const groupId = parseInt(req.params.id);
  const idx = db.groups.findIndex(g => g.id === groupId);
  if (idx === -1) return res.status(404).json({ error: 'Group not found' });

  db.groups.splice(idx, 1);
  res.status(204).send();
});

// POST /api/groups/:id/members
router.post('/:id/members', (req: Request, res: Response) => {
  const groupId = parseInt(req.params.id);
  const group = db.groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const { name, initials, avatarColor } = req.body;
  const member = {
    id: generateId(),
    name: name || 'New Member',
    initials: initials || getInitials(name || 'New Member'),
    avatarColor: avatarColor || getAvatarColor(name || 'New Member'),
  };

  group.members.push(member);
  res.status(201).json(member);
});

// DELETE /api/groups/:id/members/:memberId
router.delete('/:id/members/:memberId', (req: Request, res: Response) => {
  const groupId = parseInt(req.params.id);
  const memberId = parseInt(req.params.memberId);

  const group = db.groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const memberIdx = group.members.findIndex(m => m.id === memberId);
  if (memberIdx === -1) return res.status(404).json({ error: 'Member not found' });

  group.members.splice(memberIdx, 1);
  res.status(204).send();
});

export default router;
