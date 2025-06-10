import { chargeWithStripe } from './stripeAdapter';
import { chargeWithSquare } from './squareAdapter';
import { chargeWithFortis } from './fortisAdapter';
import { chargeWithFirstData } from './firstDataAdapter';
import { chargeWithWorldpay } from './worldpayAdapter';
import { chargeWithPaySafe } from './paySafeAdapter';
import { chargeWithAuthorizeNet } from './authorizeNetAdapter';
import { chargeWithNMI } from './nmiAdapter';

export async function processPayment(gateway: string, amount: number, token: string) {
  switch (gateway) {
    case 'stripe':
      return chargeWithStripe(amount, token);
    case 'square':
      return chargeWithSquare(amount, token);
    case 'fortis':
      return chargeWithFortis(amount, token);
    case 'firstData':
      return chargeWithFirstData(amount, token);
    case 'worldpay':
      return chargeWithWorldpay(amount, token);
    case 'paysafe':
      return chargeWithPaySafe(amount, token);
    case 'authorizeNet':
      return chargeWithAuthorizeNet(amount, token);
    case 'nmi':
      return chargeWithNMI(amount, token);
    default:
      throw new Error(`Unsupported gateway: ${gateway}`);
  }
}
