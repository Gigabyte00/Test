import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withRole } from '../../../lib/withRole';
import { Role } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export default withRole(Role.VENDOR, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId } = getAuth(req);
  const user = await prisma.user.findUnique({ where: { userId: userId! } });
  if (!user) return res.status(404).end('User not found');

  const txns = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  res.json(txns);
});
