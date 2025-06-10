import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { routeOnboarding } from '@/lib/onboardingRouter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    businessName,
    contactEmail,
    routingNumber,
    accountNumber,
    preferredProvider,
  } = req.body;

  const merchant = await prisma.merchant.create({
    data: {
      businessName,
      contactEmail,
      providerPreference: preferredProvider,
      bankAccount: {
        create: {
          routingNumber,
          accountNumber,
        },
      },
    },
    include: { bankAccount: true },
  });

  try {
    const result = await routeOnboarding(merchant, preferredProvider);
    res.status(200).json({ success: true, result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
