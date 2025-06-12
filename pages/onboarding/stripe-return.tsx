import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function StripeReturn() {
  const router = useRouter();
  const { status } = router.query;

  useEffect(() => {
    // You could show a success message or handle refresh here
  }, [status]);

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">Stripe Onboarding</h1>
      {status === 'success' ? (
        <p>Your Stripe account was created. You may close this window.</p>
      ) : (
        <p>Return to the app to continue onboarding.</p>
      )}
    </div>
  );
}
