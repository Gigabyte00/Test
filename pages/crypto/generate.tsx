import { useState } from 'react';
import QRCode from 'qrcode.react';

export default function CryptoQRGenerator() {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');
  const [walletAddress, setWalletAddress] = useState('');
  const [showQR, setShowQR] = useState(false);

  const FEE_PERCENT = 0.01;

  const handleGenerate = () => {
    if (!walletAddress || !amount) return alert('Please enter all fields.');
    setShowQR(true);
  };

  const totalAmount = parseFloat(amount);
  const fee = totalAmount * FEE_PERCENT;
  const netAmount = totalAmount - fee;

  const qrData = {
    to: walletAddress,
    token,
    amount: netAmount.toFixed(6),
    originalAmount: totalAmount.toFixed(2),
    fee: fee.toFixed(6),
  };

  const encoded = encodeURIComponent(JSON.stringify(qrData));

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Crypto Payment QR</h1>

      <input
        placeholder="Vendor Wallet Address"
        className="w-full mb-3 p-2 border"
        onChange={(e) => setWalletAddress(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount to Receive (in USDC/ETH)"
        className="w-full mb-3 p-2 border"
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="w-full mb-4 p-2 border"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      >
        <option value="USDC">USDC</option>
        <option value="ETH">ETH</option>
        <option value="USDT">USDT</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleGenerate}>
        Generate QR
      </button>

      {showQR && (
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Customer Should Send:</h2>
          <QRCode
            value={`${window.location.origin}/crypto/confirm?data=${encoded}`}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
          />
          <p className="mt-2 text-sm">
            Send {qrData.amount} {token} to: <br />
            <span className="font-mono">{walletAddress}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            (1% fee already deducted. Original: {qrData.originalAmount})
          </p>
        </div>
      )}
    </div>
  );
}
