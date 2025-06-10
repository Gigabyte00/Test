import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/api/square/callback`);
  const clientId = process.env.SQUARE_APP_ID;
  const scope = 'MERCHANT_PROFILE_READ PAYMENTS_READ PAYMENTS_WRITE';

  const url = `https://connect.squareup.com/oauth2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
  res.redirect(url);
}
