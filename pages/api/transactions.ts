import type { NextApiRequest, NextApiResponse } from 'next';
import { mockTransactions } from '../../data/mockTransactions';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ transactions: mockTransactions });
}
