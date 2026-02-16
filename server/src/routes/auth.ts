import { Router, Request, Response } from 'express';
import {
  db,
  generateId,
  generateFriendCode,
  generateToken,
  generateVerificationCode,
  getInitials,
  getAvatarColor,
} from '../db';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const existing = db.users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const name = `${firstName} ${lastName}`;
  const verificationCode = generateVerificationCode();

  const user = {
    id: generateId(),
    firstName,
    lastName,
    name,
    email,
    phone: '',
    username: email.split('@')[0],
    password,
    initials: getInitials(name),
    avatarColor: getAvatarColor(name),
    avatarUrl: '',
    friendCode: generateFriendCode(),
    isGuest: false,
    verified: false,
    verificationCode,
    createdAt: new Date(),
  };

  db.users.push(user);

  db.notificationSettings.push({
    userId: user.id,
    push: true,
    email: true,
    sms: false,
    reminders: true,
  });

  db.privacySettings.push({
    userId: user.id,
    publicProfile: true,
    showHistory: false,
  });

  console.log(`[Auth] Verification code for ${email}: ${verificationCode}`);

  res.status(201).json({
    success: true,
    data: { email: user.email },
    message: 'Registration successful. Check console for verification code.',
  });
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  const user = db.users.find(
    u => (u.email === username || u.username === username) && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.verified) {
    const newCode = generateVerificationCode();
    user.verificationCode = newCode;
    console.log(`[Auth] New verification code for ${user.email}: ${newCode}`);
    return res.json({
      success: true,
      data: {
        requiresVerification: true,
        email: user.email,
      },
      message: 'Please verify your account. Check console for code.',
    });
  }

  const token = generateToken();
  db.tokens.push({ token, userId: user.id, createdAt: new Date() });

  res.json({
    success: true,
    data: {
      accessToken: token,
      user: {
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
      },
    },
  });
});

// POST /api/auth/verify
router.post('/verify', (req: Request, res: Response) => {
  const { code, email } = req.body;

  if (!code || !email) {
    return res.status(400).json({ success: false, message: 'Code and email required' });
  }

  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.verificationCode !== code) {
    return res.status(400).json({ success: false, message: 'Invalid verification code' });
  }

  user.verified = true;
  user.verificationCode = '';

  const token = generateToken();
  db.tokens.push({ token, userId: user.id, createdAt: new Date() });

  res.json({
    success: true,
    data: {
      accessToken: token,
      user: {
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
      },
    },
  });
});

// POST /api/auth/resend-code
router.post('/resend-code', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const newCode = generateVerificationCode();
  user.verificationCode = newCode;
  console.log(`[Auth] Resent verification code for ${email}: ${newCode}`);

  res.json({ success: true, message: 'Verification code resent. Check console.' });
});

// POST /api/auth/guest
router.post('/guest', (_req: Request, res: Response) => {
  const guestId = generateId();
  const name = `Guest_${guestId}`;

  const user = {
    id: guestId,
    firstName: 'Guest',
    lastName: `${guestId}`,
    name,
    email: `guest_${guestId}@temp.local`,
    phone: '',
    username: `guest_${guestId}`,
    password: '',
    initials: 'G',
    avatarColor: getAvatarColor(name),
    avatarUrl: '',
    friendCode: generateFriendCode(),
    isGuest: true,
    verified: true,
    verificationCode: '',
    createdAt: new Date(),
  };

  db.users.push(user);

  const token = generateToken();
  db.tokens.push({ token, userId: user.id, createdAt: new Date() });

  res.json({
    success: true,
    data: {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        avatarColor: user.avatarColor,
        friendCode: user.friendCode,
        createdAt: user.createdAt,
      },
    },
  });
});

// POST /api/auth/change-password
router.post('/change-password', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Auth required' });

  const token = authHeader.split(' ')[1];
  const tokenRecord = db.tokens.find(t => t.token === token);
  if (!tokenRecord) return res.status(401).json({ success: false, message: 'Invalid token' });

  const user = db.users.find(u => u.id === tokenRecord.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both passwords required' });
  }

  if (user.password !== currentPassword) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  res.json({ success: true, message: 'Password changed successfully' });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const idx = db.tokens.findIndex(t => t.token === token);
    if (idx !== -1) db.tokens.splice(idx, 1);
  }
  res.json({ success: true, message: 'Logged out' });
});

export default router;
