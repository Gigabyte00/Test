import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const merchants = await prisma.merchant.findMany({
    include: { bankAccount: true },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(merchants);
}
