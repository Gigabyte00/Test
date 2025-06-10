import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Step1() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: '',
    contactEmail: '',
  });

  const handleNext = () => {
    sessionStorage.setItem('onboardingStep1', JSON.stringify(form));
    router.push('/onboarding/step2');
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Step 1 of 4: Business Info</h2>
      <input
        name="businessName"
        placeholder="Business Name"
        className="mb-4 p-2 w-full border"
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
      />
      <input
        name="contactEmail"
        placeholder="Contact Email"
        className="mb-4 p-2 w-full border"
        onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
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
