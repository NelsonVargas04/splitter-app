import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth';
import userRoutes from './src/routes/users';
import groupRoutes from './src/routes/groups';
import friendRoutes from './src/routes/friends';
import eventRoutes from './src/routes/events';
import billRoutes from './src/routes/bills';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bills', billRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
