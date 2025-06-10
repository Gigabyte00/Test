import type { NextApiRequest, NextApiResponse } from 'next';
import { withRole } from '../../../lib/withRole';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export default withRole(Role.ADMIN, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { id, companyName, wallet } = req.body as { id: number; companyName?: string; wallet?: string };
  await prisma.vendor.update({ where: { id }, data: { companyName, wallet } });
  res.json({ ok: true });
});
