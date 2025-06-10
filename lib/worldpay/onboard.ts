import axios from 'axios';

export async function submitToWorldPay(merchant: any) {
  const { businessName, contactEmail, bankAccount } = merchant;

  const payload = {
    partnerId: process.env.WORLDPAY_PARTNER_ID,
    businessName,
    contactEmail,
    routingNumber: bankAccount.routingNumber,
    accountNumber: bankAccount.accountNumber,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.WORLDPAY_API_KEY}`,
  };

  const res = await axios.post(
    process.env.WORLDPAY_BOARDING_URL || 'https://sandbox.worldpay.com/api/onboard',
    payload,
    { headers },
  );

  return res.data;
}
