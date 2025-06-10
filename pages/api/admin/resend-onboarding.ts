import type { NextApiRequest, NextApiResponse } from 'next';
import { withRole } from '@/lib/withRole';
import { Role } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const { userId, type } = req.body as { userId: string; type: string };

  // Placeholder: In a real app, trigger emails or onboarding flows
  console.log(`Resend ${type} onboarding for ${userId}`);

  res.status(200).json({ ok: true });
}

export default withRole(Role.ADMIN, handler);
