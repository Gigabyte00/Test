import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  const { wallet } = req.body;

  if (!userId || !wallet) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  await prisma.merchant.updateMany({
    where: { userId },
    data: { cryptoWallet: wallet },
  });

  res.status(200).json({ success: true });
}
