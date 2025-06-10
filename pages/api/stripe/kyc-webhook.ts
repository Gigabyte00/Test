import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);

    if (event.type === 'identity.verification_session.verified') {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      const userId = session.metadata?.userId as string | undefined;

      if (userId) {
        await prisma.merchant.updateMany({
          where: { userId },
          data: { kycStatus: 'VERIFIED' },
        });
      }
    }

    res.status(200).send('Received');
  } catch (err: any) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
