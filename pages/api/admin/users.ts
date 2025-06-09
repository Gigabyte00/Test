import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withRole } from '../../../lib/withRole';

const prisma = new PrismaClient();

export default withRole('ADMIN', async (_req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
