import useSWR from 'swr';
import { useState } from 'react';
import { Vendor } from '@prisma/client';

export default function VendorTable() {
  const { data, mutate } = useSWR<Vendor[]>('/api/admin/vendors');
  const [query, setQuery] = useState('');

  if (!data) return <p>Loading vendors...</p>;

  const updateVendor = async (id: number) => {
    const companyName = prompt('Company name');
    const wallet = prompt('Wallet');
    if (!companyName && !wallet) return;
    await fetch('/api/admin/update-vendor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, companyName, wallet }),
    });
    mutate();
  };

  const filtered = data.filter((v) =>
    v.companyName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Search company"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-3 p-2 border rounded w-full max-w-sm"
      />

      <table className="min-w-full text-sm border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Wallet</th>
            <th className="p-2 border">API Key</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-2 border">{v.id}</td>
              <td className="p-2 border">{v.companyName}</td>
              <td className="p-2 border">{v.wallet}</td>
              <td className="p-2 border">{v.apiKey}</td>
              <td className="p-2 border">
                <button onClick={() => updateVendor(v.id)} className="text-blue-600 underline text-sm">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
