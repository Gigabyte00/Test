import axios from 'axios';

export async function exchangeCodeForToken(code: string) {
  const res = await axios.post('https://connect.squareup.com/oauth2/token', {
    client_id: process.env.SQUARE_APP_ID,
    client_secret: process.env.SQUARE_APP_SECRET,
    code,
    grant_type: 'authorization_code',
  });

  return res.data as { access_token: string; merchant_id: string };
}
