import { submitToFirstData } from '@/lib/firstdata/onboard';
import { submitToWorldPay } from '@/lib/worldpay/onboard';
import { submitToPaySafe } from '@/lib/paysafe/onboard';
import { submitToNMI } from '@/lib/nmi/onboard';

const PROVIDER_PRIORITY = ['First Data', 'WorldPay', 'PaySafe', 'NMI'];

export async function routeOnboarding(merchant: any, preferredProvider: string) {
  const providersToTry = [
    preferredProvider,
    ...PROVIDER_PRIORITY.filter((p) => p !== preferredProvider),
  ];

  for (const provider of providersToTry) {
    try {
      if (provider === 'First Data') return await submitToFirstData(merchant);
      if (provider === 'WorldPay') return await submitToWorldPay(merchant);
      if (provider === 'PaySafe') return await submitToPaySafe(merchant);
      if (provider === 'NMI') return await submitToNMI(merchant);
    } catch (err) {
      console.warn(`Failed with ${provider}, trying next...`, err);
    }
  }

  throw new Error('All providers failed onboarding.');
}
