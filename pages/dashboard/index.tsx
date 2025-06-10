import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div style={{ padding: 20 }}>
      <SignedIn>
        <h2>Dashboard</h2>
        <p>Welcome {user?.firstName}</p>
        <Link href="/profile">Profile</Link>
      </SignedIn>
      <SignedOut>
        <p>You must <Link href="/sign-in">sign in</Link>.</p>
      </SignedOut>
    </div>
  );
}
