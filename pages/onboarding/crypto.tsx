import { useState } from 'react';

export default function CryptoWallet() {
  const [wallet, setWallet] = useState('');
  const [done, setDone] = useState(false);

  const submit = async () => {
    await fetch('/api/crypto/save-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet }),
    });
    setDone(true);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Link Your Crypto Wallet</h1>
      {done ? (
        <p className="text-green-600">Wallet saved!</p>
      ) : (
        <>
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x..."
            className="w-full border rounded p-2 mb-4 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Wallet
          </button>
        </>
      )}
    </div>
  );
}
