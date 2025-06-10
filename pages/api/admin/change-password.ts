import type { NextApiRequest, NextApiResponse } from 'next';
import { withRole } from '../../../lib/withRole';
import { clerkClient } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';

export default withRole(Role.ADMIN, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { clerkId, password } = req.body as { clerkId: string; password: string };
  await clerkClient.users.updateUser(clerkId, { password });
  res.json({ ok: true });
});
