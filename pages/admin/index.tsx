import UserTable from '../../components/UserTable';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function Admin() {
  return (
    <div style={{ padding: 20 }}>
      <SignedIn>
        <h2>Admin Users</h2>
        <UserTable />
      </SignedIn>
      <SignedOut>
        <p>Please sign in</p>
      </SignedOut>
    </div>
  );
}
