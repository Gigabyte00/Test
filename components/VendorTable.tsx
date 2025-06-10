import useSWR from 'swr';
import { Vendor } from '@prisma/client';

export default function VendorTable() {
  const { data } = useSWR<Vendor[]>('/api/admin/vendors');

  if (!data) return <p>Loading vendors...</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Company</th>
          <th>Wallet</th>
          <th>API Key</th>
        </tr>
      </thead>
      <tbody>
        {data.map(v => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{v.companyName}</td>
            <td>{v.wallet}</td>
            <td>{v.apiKey}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
