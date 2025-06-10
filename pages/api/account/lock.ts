import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).end('Unauthorized');

  const { lock } = req.body as { lock: boolean };
  await clerkClient.users.updateUser(userId, { publicMetadata: { locked: lock } });
  res.json({ ok: true });
}
