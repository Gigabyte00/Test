import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

export default function VendorDashboard() {
  const { user } = useUser();
  return (
    <div style={{ padding: 20 }}>
      <SignedIn>
        <h2>Vendor Dashboard</h2>
        <p>Welcome {user?.firstName}</p>
        <Link href="/profile">Profile</Link>
        {' | '}
        <Link href="/vendor/analytics">Analytics</Link>
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
  if (!user || user.role !== 'VENDOR') {
    return { notFound: true };
  }
  return { props: {} };
};
