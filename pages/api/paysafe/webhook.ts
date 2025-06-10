import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { merchantRefNum, status } = req.body;

  const merchantId = merchantRefNum?.replace('merchant-', '');

  await prisma.merchant.update({
    where: { id: merchantId },
    data: { paysafeStatus: status },
  });

  res.status(200).json({ updated: true });
}
