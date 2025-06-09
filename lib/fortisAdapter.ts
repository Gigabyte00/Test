interface FortisChargeResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function chargeWithFortis(amount: number, token: string): Promise<FortisChargeResponse> {
  const apiKey = process.env.FORTIS_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'Fortis API key not configured' };
  }

  try {
    const res = await fetch('https://api.fortispay.com/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ amount, token })
    });

    if (!res.ok) {
      return { success: false, error: await res.text() };
    }

    const data = await res.json();
    return { success: true, transactionId: data.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
