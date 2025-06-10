import QRCode from 'qrcode';

export interface CryptoQRData {
  wallet: string;
  amount: number;
  fee: number;
  tokenType: string;
}

export async function generateCryptoQR(data: CryptoQRData): Promise<string> {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/crypto/confirm?data=${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  return await QRCode.toDataURL(url);
}
