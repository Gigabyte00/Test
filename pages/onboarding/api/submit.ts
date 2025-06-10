import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { businessName, contactEmail, routingNumber, accountNumber, preferredProvider } = req.body;

  try {
    await prisma.merchant.create({
      data: {
        businessName,
        contactEmail,
        preferredProvider,
        bankAccount: {
          create: {
            bankName: 'Unknown',
            routingNumber,
            accountNumber,
          },
        },
      },
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'DB save failed' });
  }
}
