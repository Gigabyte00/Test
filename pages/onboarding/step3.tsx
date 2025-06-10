import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Step3() {
  const router = useRouter();
  const [provider, setProvider] = useState('First Data');

  const handleNext = () => {
    sessionStorage.setItem('onboardingStep3', JSON.stringify({ preferredProvider: provider }));
    router.push('/onboarding/step4');
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Step 3 of 4: Choose Provider</h2>
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        className="w-full mb-4 p-2 border"
      >
        <option>First Data</option>
        <option>WorldPay</option>
        <option>PaySafe</option>
        <option>Square</option>
        <option>NMI</option>
      </select>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
