import useSWR from 'swr';
import { Role } from '@prisma/client';

interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
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
              )}
              {u.role !== 'CUSTOMER' && (
                <button onClick={() => promote(u.id, Role.CUSTOMER)}>Demote</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
