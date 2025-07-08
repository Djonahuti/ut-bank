import { useForm } from 'react-hook-form';
import { PaystackButton } from 'react-paystack';
import { Input } from '@/components/ui/input';

type FormData = {
  amount: number;
  email: string;
  reason: string;
};

export default function Transfer() {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const amount = watch('amount') * 100; // Paystack uses kobo
  const email = watch('email');
  const reason = watch('reason');

  const paystackConfig = {
    reference: `TX-${Date.now()}`,
    email,
    amount,
    publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxx', // Replace with real key
    metadata: {
      custom_fields: [
        { display_name: 'Reason', variable_name: 'reason', value: reason }
      ],
    },
    onSuccess: () => {
      alert('Transaction Successful!');
      // Trigger database update or mutation here
    },
    onClose: () => alert('Payment closed'),
  };

  return (
    <form onSubmit={handleSubmit(() => {})} className="max-w-md mx-auto mt-10 space-y-4">
      <Input {...register('email')} placeholder="Recipient Email" required />
      <Input type="number" {...register('amount')} placeholder="Amount (₦)" required />
      <Input {...register('reason')} placeholder="Reason (optional)" />
      <PaystackButton {...paystackConfig} className="bg-green-600 text-white px-4 py-2 rounded" />
    </form>
  );
}
