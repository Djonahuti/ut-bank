import { PaystackButton } from 'react-paystack';

const config = {
  reference: new Date().getTime().toString(),
  email: 'customer@email.com',
  amount: 50000, // amount in kobo
  publicKey: 'your-public-key',
};

<PaystackButton {...config} />
