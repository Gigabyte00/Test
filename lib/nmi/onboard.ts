import axios from 'axios';
import qs from 'querystring';

export async function submitToNMI(merchant: any) {
  const { businessName, contactEmail } = merchant;

  const payload = qs.stringify({
    security_key: process.env.NMI_SECURITY_KEY,
    processor_id: process.env.NMI_PROCESSOR_ID,
    company: businessName,
    email: contactEmail,
    first_name: merchant.ownerFirstName,
    last_name: merchant.ownerLastName,
    routing_number: merchant.bankAccount.routingNumber,
    account_number: merchant.bankAccount.accountNumber,
  });

  const res = await axios.post(
    'https://secure.networkmerchants.com/api/transact.php',
    payload,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (res.data.includes('response=1')) {
    const match = res.data.match(/gateway_id=(\w+)/);
    return { gatewayId: match?.[1] ?? null };
  }

  throw new Error('NMI onboarding failed: ' + res.data);
}
