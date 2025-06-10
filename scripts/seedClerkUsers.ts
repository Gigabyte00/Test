import { clerkClient } from '@clerk/nextjs/server';

async function main() {
  const admin = await clerkClient.users.createUser({
    emailAddress: ['admin@example.com'],
    password: 'adminpass',
    firstName: 'Admin',
    publicMetadata: { role: 'ADMIN' }
  });

  const vendor = await clerkClient.users.createUser({
    emailAddress: ['vendor@example.com'],
    password: 'vendorpass',
    firstName: 'Vendor',
    publicMetadata: { role: 'VENDOR', wallet: '0x123' }
  });

  console.log('Created users', admin.id, vendor.id);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
