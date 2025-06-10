import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Confirm() {
  const router = useRouter();
  const [status, setStatus] = useState('Waiting for payment...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (router.query.data) {
      try {
        setData(JSON.parse(router.query.data as string));
      } catch (err) {
        console.error('Invalid data');
      }
    }
  }, [router.query]);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Send Payment</h2>
      <p>
        Send {data.amount} {data.tokenType} to address:
      </p>
      <p style={{ fontFamily: 'monospace' }}>{data.wallet}</p>
      <p>Fee: {data.fee}</p>
      <button
        onClick={() => setStatus('Confirmed')}
        className="bg-green-600 text-white px-4 py-2 mt-2"
      >
        I Sent Payment
      </button>
      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
}
