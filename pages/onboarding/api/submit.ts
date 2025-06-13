import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { prisma } from '../../lib/prisma';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const form = formidable({ uploadDir: './public/uploads', keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parse error' });

    const {
      businessName,
      businessType,
      website,
      contact,
      bankName,
      routing,
      account,
      firstName,
      lastName,
      ssn,
      dob,
      address,
      pricingPlan,
      clerkId,
      preferredProvider,
    } = fields as Record<string, any>;

    const voidedCheck = (files as any).voidCheck?.[0]?.newFilename || null;
    const govId = (files as any).govId?.[0]?.newFilename || null;

    try {
      const bankAccount = await prisma.bankAccount.create({
        data: {
          bankName: bankName || 'Unknown',
          routingNumber: routing,
          accountNumber: account,
          voidedCheckUrl: voidedCheck ? `/uploads/${voidedCheck}` : undefined,
        },
      });

      const ownerKyc = await prisma.ownerKYC.create({
        data: {
          firstName,
          lastName,
          ssnLast4: ssn,
          dob: new Date(dob),
          address,
          govIdUrl: govId ? `/uploads/${govId}` : undefined,
        },
      });

      await prisma.merchant.create({
        data: {
          userId: clerkId,
          businessName,
          businessType,
          website,
          contactEmail: contact,
          bankAccountId: bankAccount.id,
          ownerKycId: ownerKyc.id,
          pricingPlan,
          preferredProvider,
        },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'DB save failed' });
    }
  });
}
