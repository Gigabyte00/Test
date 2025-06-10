import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Role } from '@prisma/client';
import { withRole } from '../../../lib/withRole';

const prisma = new PrismaClient();

export default withRole('ADMIN', async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { id, role } = req.body as { id: number; role: Role };
  await prisma.user.update({ where: { id }, data: { role } });
  res.json({ ok: true });
});
