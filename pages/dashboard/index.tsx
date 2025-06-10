import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [merchants, setMerchants] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/merchants')
      .then((res) => res.json())
      .then((data) => setMerchants(data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Onboarding Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse border border-gray-700 dark:text-white">
          <thead>
            <tr className="bg-gray-200 dark:bg-zinc-800">
              <th className="px-4 py-2 border">Business</th>
              <th className="px-4 py-2 border">Preferred</th>
              <th className="px-4 py-2 border">First Data</th>
              <th className="px-4 py-2 border">WorldPay</th>
              <th className="px-4 py-2 border">PaySafe</th>
              <th className="px-4 py-2 border">Square</th>
              <th className="px-4 py-2 border">NMI</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((m: any) => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-2 border">{m.businessName}</td>
                <td className="px-4 py-2 border">{m.providerPreference}</td>
                <td className="px-4 py-2 border">{m.fiservStatus || '-'}</td>
                <td className="px-4 py-2 border">{m.worldpayStatus || '-'}</td>
                <td className="px-4 py-2 border">{m.paysafeStatus || '-'}</td>
                <td className="px-4 py-2 border">{m.squareMerchantId ? '✔' : '-'}</td>
                <td className="px-4 py-2 border">{m.nmiGatewayId ? '✔' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
