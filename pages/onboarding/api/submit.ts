import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export const config = {
  api: { bodyParser: false }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Parse error' });
      return;
    }
    const clerkId = fields.clerkId as string;
    console.log('Received onboarding:', { clerkId, ...fields, files });
    res.status(200).json({ ok: true });
  });
}
