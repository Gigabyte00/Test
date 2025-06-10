import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { submitToWorldPay } from '@/lib/worldpay/onboard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { merchantId } = req.body;

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: { bankAccount: true },
  });

  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

  try {
    const result = await submitToWorldPay(merchant);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
