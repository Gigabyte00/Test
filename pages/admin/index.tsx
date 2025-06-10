import UserTable from '../../components/UserTable';
import VendorTable from '../../components/VendorTable';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { GetServerSideProps } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

export default function Admin() {
  return (
    <div style={{ padding: 20 }}>
      <SignedIn>
        <h2>Admin Dashboard</h2>
        <UserTable />
        <h3 style={{ marginTop: 40 }}>Vendors</h3>
        <VendorTable />
        <p style={{ marginTop: 40 }}>
          <a href="/admin/analytics">View Analytics</a>
        </p>
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
    return {
      redirect: { destination: '/sign-in', permanent: false }
    };
  }

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user || user.role !== 'ADMIN') {
    return { notFound: true };
  }

  return { props: {} };
};
