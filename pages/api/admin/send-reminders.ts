import type { NextApiRequest, NextApiResponse } from 'next';
import { withRole } from '@/lib/withRole';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const merchants = await prisma.merchant.findMany({
      where: {
        OR: [
          { stripeAccountId: null },
          { fortisMerchantId: null },
          { kycStatus: { not: 'KYC_VERIFIED' } },
        ],
      },
    });

    // Placeholder: send email reminders
    merchants.forEach(m => {
      console.log('Send reminder to', m.contactEmail);
    });

    res.status(200).json({ count: merchants.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default withRole(Role.ADMIN, handler);
