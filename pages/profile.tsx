import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user } = useUser();
  const [wallet, setWallet] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  useEffect(() => {
    if (user?.publicMetadata.role === 'VENDOR') {
      setWallet((user.publicMetadata as any).wallet || '');
    }
    if (user) {
      setTwoFAEnabled((user as any).twoFactorEnabled || false);
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
        <button
          onClick={async () => {
            const password = prompt('New password');
            if (!password) return;
            await fetch('/api/account/change-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password })
            });
            alert('Password changed');
          }}
        >
          Change Password
        </button>
        <button
          onClick={async () => {
            if (!user) return;
            if (twoFAEnabled && (user as any).disableTOTP) {
              await (user as any).disableTOTP();
              setTwoFAEnabled(false);
            } else if (!twoFAEnabled && (user as any).enableTOTP) {
              await (user as any).enableTOTP();
              setTwoFAEnabled(true);
            }
          }}
        >
          {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
        <button
          onClick={async () => {
            const lock = confirm('Lock your account?');
            await fetch('/api/account/lock', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lock })
            });
          }}
        >
          Lock Account
        </button>
      </div>
    </div>
  );
}
