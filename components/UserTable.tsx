import useSWR from 'swr';
import { useState } from 'react';
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
  const [query, setQuery] = useState('');

  const promote = async (id: number, role: Role) => {
    await fetch('/api/admin/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
  };

  const lock = async (userId: string, state: boolean) => {
    await fetch('/api/admin/lock-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId: userId, lock: state }),
    });
  };

  const resetPw = async (userId: string) => {
    const pw = prompt('New password');
    if (!pw) return;
    await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId: userId, password: pw }),
    });
  };

  if (!data) return <p>Loading...</p>;

  const filtered = data.filter((u) =>
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Search email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-3 p-2 border rounded w-full max-w-sm"
      />

      <table className="min-w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Created</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 border space-x-2">
                {u.role !== 'ADMIN' && (
                  <button onClick={() => promote(u.id, Role.ADMIN)}>Promote</button>
                )}
                {u.role !== 'CUSTOMER' && (
                  <button onClick={() => promote(u.id, Role.CUSTOMER)}>Demote</button>
                )}
                <button onClick={() => lock(u.userId, true)}>Lock</button>
                <button onClick={() => lock(u.userId, false)}>Unlock</button>
                <button onClick={() => resetPw(u.userId)}>Reset PW</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
