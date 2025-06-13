import { prisma } from '../../lib/prisma';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async () => {
  const merchants = await prisma.merchant.findMany({
    include: {
      bankAccount: true,
      ownerKyc: true,
    },
  });

  return { props: { merchants } };
};

export default function Dashboard({ merchants }: any) {
  const [selected, setSelected] = useState<any>(null);
  const [query, setQuery] = useState('');

  const filtered = merchants
    .filter((m: any) =>
      m.businessName.toLowerCase().includes(query.toLowerCase()) ||
      m.contactEmail.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a: any, b: any) => a.businessName.localeCompare(b.businessName));

  const markStatus = async (userId: string, type: string) => {
    await fetch('/api/admin/mark-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type }),
    });
    alert('Status updated!');
  };

  const resendOnboarding = async (userId: string, type: string) => {
    await fetch('/api/admin/resend-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type }),
    });
    alert(`${type} onboarding resent.`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Merchant Onboarding Dashboard</h1>

      <input
        type="text"
        placeholder="Search by business or email"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mb-4 px-4 py-2 border w-full rounded"
      />

      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100 text-sm font-semibold">
          <tr>
            <th className="p-4 text-left">Business</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-center">Stripe</th>
            <th className="p-4 text-center">KYC</th>
            <th className="p-4 text-center">Fortis</th>
            <th className="p-4 text-center">Crypto</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m: any) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{m.businessName}</td>
              <td className="p-4">{m.contactEmail}</td>
              <td className="p-4 text-center">{m.stripeAccountId ? '✅' : '❌'}</td>
              <td className="p-4 text-center">{m.kycStatus === 'KYC_VERIFIED' ? '✅' : '❌'}</td>
              <td className="p-4 text-center">{m.fortisMerchantId ? '✅' : '❌'}</td>
              <td className="p-4 text-center">{m.cryptoWallet ? '✅' : '❌'}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => setSelected(m)}
                  className="text-blue-600 underline text-sm"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Merchant Details</h2>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <div className="space-y-3 text-sm">
              <p><strong>Business:</strong> {selected.businessName}</p>
              <p><strong>Contact:</strong> {selected.contactEmail}</p>
              <p><strong>Website:</strong> {selected.website}</p>
              <p><strong>Plan:</strong> {selected.pricingPlan}</p>
              <p><strong>Bank:</strong> {selected.bankAccount?.bankName} ****{selected.bankAccount?.accountNumber?.slice(-4)}</p>
              <p><strong>Owner:</strong> {selected.ownerKyc?.firstName} {selected.ownerKyc?.lastName}</p>
              <p><strong>Crypto Wallet:</strong> {selected.cryptoWallet || 'Not linked'}</p>

              <div className="flex gap-4 mt-4 flex-wrap">
                <button onClick={() => markStatus(selected.userId, 'kyc')} className="btn">Mark KYC ✅</button>
                <button onClick={() => markStatus(selected.userId, 'stripe')} className="btn">Mark Stripe ✅</button>
                <button onClick={() => markStatus(selected.userId, 'fortis')} className="btn">Mark Fortis ✅</button>
                <button onClick={() => resendOnboarding(selected.userId, 'stripe')} className="btn-outline">Resend Stripe</button>
                <button onClick={() => resendOnboarding(selected.userId, 'fortis')} className="btn-outline">Resend Fortis</button>
                <button onClick={() => resendOnboarding(selected.userId, 'kyc')} className="btn-outline">Resend KYC</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
