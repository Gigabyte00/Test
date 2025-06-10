import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Step2() {
  const router = useRouter();
  const [form, setForm] = useState({
    routingNumber: '',
    accountNumber: '',
  });

  const handleNext = () => {
    sessionStorage.setItem('onboardingStep2', JSON.stringify(form));
    router.push('/onboarding/step3');
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Step 2 of 4: Banking Info</h2>
      <input
        name="routingNumber"
        placeholder="Routing Number"
        className="mb-4 p-2 w-full border"
        onChange={(e) => setForm({ ...form, routingNumber: e.target.value })}
      />
      <input
        name="accountNumber"
        placeholder="Account Number"
        className="mb-4 p-2 w-full border"
        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
