import { chargeWithStripe } from './stripeAdapter';
import { chargeWithSquare } from './squareAdapter';
import { chargeWithFortis } from './fortisAdapter';

export async function processPayment(gateway: string, amount: number, token: string) {
  switch (gateway) {
    case 'stripe':
      return chargeWithStripe(amount, token);
    case 'square':
      return chargeWithSquare(amount, token);
    case 'fortis':
      return chargeWithFortis(amount, token);
    default:
      throw new Error(`Unsupported gateway: ${gateway}`);
  }
}
