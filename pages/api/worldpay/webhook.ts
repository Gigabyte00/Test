import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { merchantId, status } = req.body;

  await prisma.merchant.update({
    where: { id: merchantId },
    data: { worldpayStatus: status },
  });

  res.status(200).json({ received: true });
}
