import type { NextApiRequest, NextApiResponse } from 'next';
import { withRole } from '@/lib/withRole';
import { Role, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const { userId, type } = req.body as { userId: string; type: string };
  try {
    let data: any = {};
    if (type === 'kyc') data.kycStatus = 'KYC_VERIFIED';
    if (type === 'stripe') data.stripeAccountId = `manual_${Date.now()}`;
    if (type === 'fortis') data.fortisMerchantId = `manual_${Date.now()}`;
    if (type === 'crypto') data.cryptoWallet = 'linked';

    await prisma.merchant.updateMany({ where: { userId }, data });
    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default withRole(Role.ADMIN, handler);
