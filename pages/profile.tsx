import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user } = useUser();
  const [wallet, setWallet] = useState('');

  useEffect(() => {
    if (user?.publicMetadata.role === 'VENDOR') {
      setWallet((user.publicMetadata as any).wallet || '');
    }
  }, [user]);

  if (!user) return null;

  const isVendor = user.publicMetadata.role === 'VENDOR';

  return (
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>
      <p>Name: {user.firstName}</p>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
      <p>Phone: {user.phoneNumbers[0]?.phoneNumber}</p>
      <p>Role: {user.publicMetadata.role}</p>
      {isVendor && (
        <div>
          <label>Wallet:</label>
          <input value={wallet} onChange={e => setWallet(e.target.value)} />
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <button>Change Password</button>
        <button>Toggle 2FA</button>
        <button>Lock Account</button>
      </div>
    </div>
  );
}
