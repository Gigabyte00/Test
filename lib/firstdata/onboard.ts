import axios from 'axios';

export async function submitToFirstData(merchant: any) {
  const { businessName, contactEmail, bankAccount } = merchant;

  const payload = {
    merchantName: businessName,
    contactEmail,
    routingNumber: bankAccount?.routingNumber,
    accountNumber: bankAccount?.accountNumber,
    mid: process.env.FIRSTDATA_MID,
    tid: process.env.FIRSTDATA_TID,
    isoId: process.env.FIRSTDATA_ISO_ID,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.FIRSTDATA_API_KEY}`,
  };

  const res = await axios.post('https://api.firstdata.com/buypass/onboard', payload, { headers });
  return res.data;
}
