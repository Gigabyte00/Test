import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

const schema = z.object({
  businessName: z.string().min(2),
  businessType: z.string(),
  website: z.string().url().optional(),
  contact: z.string().email(),
  bankName: z.string(),
  routing: z.string().length(9),
  account: z.string(),
  confirmAccount: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  ssn: z.string().length(4),
  dob: z.string(),
  address: z.string(),
  pricingPlan: z.enum(['Starter', 'Pro', 'Custom']),
  govId: z.any().optional(),
  voidCheck: z.any().optional(),
}).refine(d => d.account === d.confirmAccount, {
  path: ['confirmAccount'],
  message: 'Account numbers must match',
});

const steps = ['Business Info', 'Bank Info', 'KYC', 'Pricing Plan', 'Review'];

export default function OnboardingWizard() {
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: 'onChange' });

  const next = async () => {
    const valid = await trigger();
    if (valid) setStep(s => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList) {
        if (v.length > 0) formData.append(k, v[0]);
      } else {
        formData.append(k, v as string);
      }
    });
    formData.append('clerkId', user?.id || '');
    const res = await fetch('/onboarding/api/submit', { method: 'POST', body: formData });
    alert(res.ok ? 'Submitted!' : 'Error');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Step {step + 1}: {steps[step]}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 && (
          <>
            <input {...register('businessName')} placeholder="Business Name" className="input" />
            <select {...register('businessType')} className="input">
              <option value="">Select Type</option>
              <option value="LLC">LLC</option>
              <option value="Sole Proprietor">Sole Proprietor</option>
              <option value="Corp">Corp</option>
              <option value="Non-Profit">Non-Profit</option>
            </select>
            <input {...register('website')} placeholder="Website URL" className="input" />
            <input {...register('contact')} placeholder="Email" className="input" />
          </>
        )}
        {step === 1 && (
          <>
            <input {...register('bankName')} placeholder="Bank Name" className="input" />
            <input {...register('routing')} placeholder="Routing Number" className="input" />
            <input {...register('account')} placeholder="Account Number" className="input" />
            <input {...register('confirmAccount')} placeholder="Confirm Account" className="input" />
            <label className="block">Upload Voided Check <input type="file" {...register('voidCheck')} /></label>
          </>
        )}
        {step === 2 && (
          <>
            <input {...register('firstName')} placeholder="First Name" className="input" />
            <input {...register('lastName')} placeholder="Last Name" className="input" />
            <input {...register('ssn')} placeholder="Last 4 of SSN" className="input" />
            <input {...register('dob')} type="date" className="input" />
            <input {...register('address')} placeholder="Address" className="input" />
            <label className="block">Upload Government ID <input type="file" {...register('govId')} /></label>
          </>
        )}
        {step === 3 && (
          <>
            <label className="block"><input type="radio" {...register('pricingPlan')} value="Starter" /> Starter</label>
            <label className="block"><input type="radio" {...register('pricingPlan')} value="Pro" /> Pro</label>
            <label className="block"><input type="radio" {...register('pricingPlan')} value="Custom" /> Custom</label>
          </>
        )}
        {step === 4 && (
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(watch(), null, 2)}</pre>
        )}
        <div className="flex justify-between">
          {step > 0 && <button type="button" onClick={back} className="btn">Back</button>}
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">Next</button>
          ) : (
            <button type="submit" className="btn-primary">Submit</button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
