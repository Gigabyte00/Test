import { useEffect, useState } from 'react';

export default function ConfirmCryptoPayment() {
  const [qrData, setQrData] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'waiting' | 'confirmed'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrPayload = params.get('data');

    if (qrPayload) {
      try {
        setQrData(JSON.parse(decodeURIComponent(qrPayload)));
        setStatus('waiting');
      } catch (err) {
        alert('Invalid QR data.');
      }
    }
  }, []);

  const handleConfirm = () => {
    setStatus('confirmed');
    // Optional: Call backend webhook to notify vendor of payment
  };

  if (!qrData) {
    return <div className="p-6">No QR data found. Please scan a valid crypto payment QR.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Crypto Payment</h1>

      <div className="mb-4">
        <p className="text-lg">Send <strong>{qrData.amount} {qrData.token}</strong></p>
        <p>To Wallet:</p>
        <p className="bg-gray-100 p-2 font-mono rounded text-sm break-all">{qrData.to}</p>
        <p className="text-xs mt-1 text-gray-500">(1% fee applied from {qrData.originalAmount})</p>
      </div>

      {status === 'waiting' && (
        <button
          onClick={handleConfirm}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          I’ve Sent the Payment
        </button>
      )}

      {status === 'confirmed' && (
        <p className="text-green-600 font-semibold">✔️ Payment confirmed. Thank you!</p>
      )}
    </div>
  );
}
