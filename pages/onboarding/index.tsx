import { useState } from 'react';
import { useRouter } from 'next/router';

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: '',
    contactEmail: '',
    routingNumber: '',
    accountNumber: '',
    preferredProvider: 'First Data',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/onboarding/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Submitted successfully!');
      router.push('/dashboard');
    } else {
      alert('Submission failed.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-zinc-900 shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Merchant Onboarding</h1>

      <input
        name="businessName"
        placeholder="Business Name"
        className="w-full mb-3 p-2 border dark:bg-zinc-800"
        onChange={handleChange}
      />
      <input
        name="contactEmail"
        placeholder="Contact Email"
        className="w-full mb-3 p-2 border dark:bg-zinc-800"
        onChange={handleChange}
      />
      <input
        name="routingNumber"
        placeholder="Routing Number"
        className="w-full mb-3 p-2 border dark:bg-zinc-800"
        onChange={handleChange}
      />
      <input
        name="accountNumber"
        placeholder="Account Number"
        className="w-full mb-3 p-2 border dark:bg-zinc-800"
        onChange={handleChange}
      />

      <label className="block text-sm font-semibold mb-1">Preferred Provider</label>
      <select
        name="preferredProvider"
        value={form.preferredProvider}
        onChange={handleChange}
        className="w-full mb-4 p-2 border dark:bg-zinc-800"
      >
        <option value="First Data">First Data</option>
        <option value="WorldPay">WorldPay</option>
        <option value="PaySafe">PaySafe</option>
        <option value="Square">Square</option>
        <option value="NMI">NMI</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleSubmit}
      >
        Submit Application
      </button>
    </div>
  );
}
