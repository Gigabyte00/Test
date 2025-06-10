import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { generateCryptoQR, CryptoQRData } from '../../lib/crypto/qr';

export default function GenerateQR({ wallet }: { wallet: string }) {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');
  const [qr, setQr] = useState('');

  const handleGenerate = async () => {
    const amt = parseFloat(amount);
    if (!wallet || !amt) return;
    const data: CryptoQRData = {
      wallet,
      amount: amt,
      fee: parseFloat((amt * 0.01).toFixed(2)),
      tokenType: token,
    };
    const url = await generateCryptoQR(data);
    setQr(url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Generate Payment QR</h2>
      <div>
        <label>Amount</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} className="border px-2" />
      </div>
      <div>
        <label>Token</label>
        <select value={token} onChange={e => setToken(e.target.value)} className="border px-2">
          <option value="USDC">USDC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>
      <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 mt-2">Generate</button>
      {qr && (
        <div style={{ marginTop: 20 }}>
          <img src={qr} alt="crypto qr" />
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return { redirect: { destination: '/sign-in', permanent: false } };
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user || user.role !== 'VENDOR') {
    return { notFound: true };
  }
  const vendor = await prisma.vendor.findUnique({ where: { clerkUserId: userId } });
  return { props: { wallet: vendor?.wallet || '' } };
};
