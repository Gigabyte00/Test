import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      userId: 'admin_clerk_id',
      email: 'admin@example.com',
      name: 'Admin',
      role: Role.ADMIN
    }
  });

  // Create vendor user and vendor record
  const vendor = await prisma.vendor.upsert({
    where: { clerkUserId: 'vendor_clerk_id' },
    update: {},
    create: {
      clerkUserId: 'vendor_clerk_id',
      companyName: 'Test Vendor',
      wallet: '0x123',
      apiKey: 'secret'
    }
  });

  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      userId: 'vendor_clerk_id',
      email: 'vendor@example.com',
      name: 'Vendor',
      role: Role.VENDOR,
      vendorId: vendor.id
    }
  });

  const bankAccount = await prisma.bankAccount.create({
    data: {
      bankName: 'Bank',
      routingNumber: '123456789',
      accountNumber: '987654321',
    }
  });

  const ownerKyc = await prisma.ownerKYC.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      ssnLast4: '1234',
      dob: new Date('1990-01-01'),
      address: '123 Test St',
    }
  });

  await prisma.merchant.create({
    data: {
      userId: 'vendor_clerk_id',
      businessName: 'Vendor Biz',
      businessType: 'LLC',
      contactEmail: 'vendor@example.com',
      bankAccountId: bankAccount.id,
      ownerKycId: ownerKyc.id,
      pricingPlan: 'STARTER',
    }
  });

  await prisma.transaction.createMany({
    data: [
      { userId: admin.id, amount: 1000, gateway: 'stripe' },
      { userId: vendorUser.id, amount: 2000, gateway: 'fortis' }
    ]
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
