import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const event = req.body as any;
  const { user_reference, status, merchant_id } = event;

  try {
    if (status === 'APPROVED') {
      await prisma.merchant.update({
        where: { userId: user_reference },
        data: { fortisMerchantId: merchant_id, status: 'APPROVED' }
      });
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
