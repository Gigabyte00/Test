import useSWR from 'swr';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Transaction } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

export default function Analytics() {
  const { data } = useSWR<Transaction[]>('/api/admin/transactions');

  return (
    <div style={{ padding: 20 }}>
      <SignedIn>
        <h2>Transaction Analytics</h2>
        {!data && <p>Loading...</p>}
        {data && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Gateway</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.userId}</td>
                  <td>{t.amount}</td>
                  <td>{t.gateway}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SignedIn>
      <SignedOut>
        <p>Please sign in</p>
      </SignedOut>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return { redirect: { destination: '/sign-in', permanent: false } };
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user || user.role !== 'ADMIN') {
    return { notFound: true };
  }
  return { props: {} };
};
