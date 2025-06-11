import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { prisma } from '../../lib/prisma';


export const config = {
  api: { bodyParser: false }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ uploadDir: "./public/uploads", keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parse error' });

    const {
      businessName, businessType, website, contact,
      bankName, routing, account,
      firstName, lastName, ssn, dob, address,
      pricingPlan, clerkId
    } = fields as Record<string, any>;

    const voidedCheck = (files as any).voidCheck?.[0]?.newFilename || null;
    const govId = (files as any).govId?.[0]?.newFilename || null;

    try {
      const bankAccount = await prisma.bankAccount.create({
        data: {
          bankName: bankName as string,
          routingNumber: routing as string,
          accountNumber: account as string,
          voidedCheckUrl: voidedCheck ? `/uploads/${voidedCheck}` : undefined,
        },
      });

      const ownerKyc = await prisma.ownerKYC.create({
        data: {
          firstName: firstName as string,
          lastName: lastName as string,
          ssnLast4: ssn as string,
          dob: new Date(dob as string),
          address: address as string,
          govIdUrl: govId ? `/uploads/${govId}` : undefined,
        },
      });

      await prisma.merchant.create({
        data: {
          userId: clerkId as string,
          businessName: businessName as string,
          businessType: businessType as string,
          website: website as string,
          contactEmail: contact as string,
          bankAccountId: bankAccount.id,
          ownerKycId: ownerKyc.id,
          pricingPlan: pricingPlan as any,
        },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'DB save failed' });
    }

  });
}
