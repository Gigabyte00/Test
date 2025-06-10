import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withRole } from '../../../lib/withRole';

const prisma = new PrismaClient();

export default withRole('ADMIN', async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const transactions = await prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(transactions);
});
