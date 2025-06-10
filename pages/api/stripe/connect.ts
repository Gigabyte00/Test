import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId, email } = req.body as { userId: string; email: string };

  try {
    const account = await stripe.accounts.create({
      type: 'standard',
      email,
      metadata: { userId },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/stripe-return?status=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/stripe-return?status=success`,
      type: 'account_onboarding',
    });

    await prisma.merchant.updateMany({
      where: { userId },
      data: { stripeAccountId: account.id },
    });

    res.status(200).json({ url: accountLink.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create connect link' });
  }
}
