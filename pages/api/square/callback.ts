import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { exchangeCodeForToken } from '@/lib/square/oauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query as { code?: string };
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    const { access_token, merchant_id } = await exchangeCodeForToken(code);

    await prisma.merchant.updateMany({
      where: { squareMerchantId: null },
      data: { squareMerchantId: merchant_id, squareAccessToken: access_token },
    });

    res.status(200).json({ connected: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect Square' });
  }
}
