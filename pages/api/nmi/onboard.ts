import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { submitToNMI } from '@/lib/nmi/onboard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { merchantId } = req.body;

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: { bankAccount: true },
  });

  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

  try {
    const { gatewayId } = await submitToNMI(merchant as any);
    await prisma.merchant.update({
      where: { id: merchantId },
      data: { nmiGatewayId: gatewayId },
    });
    res.status(200).json({ success: true, gatewayId });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
