import { getAuth } from '@clerk/nextjs/server';
import { Role, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

export function withRole(role: Role, handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user || user.role !== role) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    return handler(req, res);
  };
}
