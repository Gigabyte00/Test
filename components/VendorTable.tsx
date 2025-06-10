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

  const filtered = data.filter(v =>
    v.companyName?.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div>
      <input
        placeholder="Search company"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginBottom: 8 }}
      />
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Company</th>
          <th>Wallet</th>
          <th>API Key</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {filtered.map(v => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{v.companyName}</td>
            <td>{v.wallet}</td>
            <td>{v.apiKey}</td>
            <td><button onClick={() => updateVendor(v.id)}>Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
