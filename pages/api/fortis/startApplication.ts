import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { businessName, contactEmail, userId } = req.body as {
    businessName: string; contactEmail: string; userId: string;
  };

  try {
    const response = await fetch('https://api.fortispay.com/v1/merchant-onboarding/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FORTIS_API_KEY}`
      },
      body: JSON.stringify({
        partner_id: process.env.FORTIS_PARTNER_ID,
        company_name: businessName,
        contact_email: contactEmail,
        user_reference: userId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/fortis/return`
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json({ applicationUrl: data.application_link });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
