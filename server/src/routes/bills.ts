import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware';

const router = Router();

router.use(authMiddleware);

// POST /api/bills/parse
router.post('/parse', (req: Request, res: Response) => {
  const { qrData } = req.body;

  if (!qrData) {
    return res.status(400).json({ success: false, message: 'QR data required' });
  }

  // TODO: Implement real QR bill parsing
  // For now, simulate parsing a bill QR code
  const simulatedTotal = Math.floor(Math.random() * 50000 + 1000) / 100;

  res.json({
    success: true,
    data: {
      total: simulatedTotal,
      items: [
        'Item parsed from QR',
      ],
    },
  });
});

export default router;
