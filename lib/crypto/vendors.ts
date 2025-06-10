import { prisma } from '../prisma';

export async function getVendorWallet(clerkUserId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { clerkUserId } });
  return vendor?.wallet || null;
}

export async function saveVendorWallet(clerkUserId: string, wallet: string) {
  return prisma.vendor.upsert({
    where: { clerkUserId },
    update: { wallet },
    create: { clerkUserId, wallet },
  });
}
