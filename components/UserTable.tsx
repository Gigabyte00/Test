import useSWR from 'swr';
import { Role } from '@prisma/client';

interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
  userId: string;
}

export default function UserTable() {
  const { data } = useSWR<User[]>('/api/admin/users');

  const promote = async (id: number, role: Role) => {
    await fetch('/api/admin/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role })
    });
  };

  const lock = async (userId: string, state: boolean) => {
    await fetch('/api/admin/lock-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId: userId, lock: state })
    });
  };

  const resetPw = async (userId: string) => {
    const pw = prompt('New password');
    if (!pw) return;
    await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId: userId, password: pw })
    });
  };


  if (!data) return <p>Loading...</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map(u => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            <td>
              {u.role !== 'ADMIN' && (
                <button onClick={() => promote(u.id, Role.ADMIN)}>Promote</button>
              )}{' '}
              {u.role !== 'CUSTOMER' && (
                <button onClick={() => promote(u.id, Role.CUSTOMER)}>Demote</button>
              )}{' '}
              <button onClick={() => lock(u.userId, true)}>Lock</button>{' '}
              <button onClick={() => lock(u.userId, false)}>Unlock</button>{' '}
              <button onClick={() => resetPw(u.userId)}>Reset PW</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
