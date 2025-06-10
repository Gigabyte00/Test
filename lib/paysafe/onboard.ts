import axios from 'axios';

export async function submitToPaySafe(merchant: any) {
  const { businessName, contactEmail, bankAccount } = merchant;

  const payload = {
    merchantRefNum: `merchant-${merchant.id}`,
    merchantName: businessName,
    contactEmail,
    ach: {
      accountHolderName: businessName,
      accountNumber: bankAccount.accountNumber,
      routingNumber: bankAccount.routingNumber,
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization:
      'Basic ' +
      Buffer.from(`${process.env.PAYSAFE_API_KEY}:${process.env.PAYSAFE_SECRET}`).toString('base64'),
  };

  const res = await axios.post(
    `https://api.test.paysafe.com/customervault/v1/${process.env.PAYSAFE_ACCOUNT_ID}/merchants`,
    payload,
    { headers },
  );

  return res.data;
}
