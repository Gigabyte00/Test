import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Step4() {
  const router = useRouter();
  const [finalForm, setFinalForm] = useState<any>({});

  useEffect(() => {
    const step1 = JSON.parse(sessionStorage.getItem('onboardingStep1') || '{}');
    const step2 = JSON.parse(sessionStorage.getItem('onboardingStep2') || '{}');
    const step3 = JSON.parse(sessionStorage.getItem('onboardingStep3') || '{}');
    setFinalForm({ ...step1, ...step2, ...step3 });
  }, []);

  const handleSubmit = async () => {
    const res = await fetch('/api/onboarding/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalForm),
    });

    if (res.ok) {
      alert('Onboarding submitted!');
      sessionStorage.removeItem('onboardingStep1');
      sessionStorage.removeItem('onboardingStep2');
      sessionStorage.removeItem('onboardingStep3');
      router.push('/dashboard');
    } else {
      alert('Submission failed.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Step 4 of 4: Review & Submit</h2>
      <pre className="bg-gray-100 p-4 text-sm mb-4 rounded">
        {JSON.stringify(finalForm, null, 2)}
      </pre>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
