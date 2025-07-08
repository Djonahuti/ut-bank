import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { gql } from 'graphql-request';
import { gqlClient } from '@/lib/graphql';
import { nhost } from '@/nhost';

type SignupFormData = {
  email: string;
  password: string;
  fullName: string;
};

const INSERT_USER = gql`
  mutation InsertUser($id: uuid!, $full_name: String!, $email: String!) {
    insert_users_one(object: {
      id: $id,
      full_name: $full_name,
      email: $email,
      balance: 0
    }) {
      id
    }
  }
`;

export default function Signup() {
  useAuth();
  const { register, handleSubmit } = useForm<SignupFormData>();
  const navigate = useNavigate();

  const onSubmit = async ({ email, password, fullName }: SignupFormData) => {
    const result = await nhost.signUp({
      email,
      password,
    });

    if (result.error) {
      alert(result.error.message);
      return;
    }

    const user = result.session?.user;
    if (!user) {
      alert("Signup successful. Please verify your email.");
      return;
    }

    // Insert into custom `users` table
    await gqlClient.request(INSERT_USER, {
      id: user.id,
      full_name: fullName,
      email: user.email,
    });

    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-20 space-y-4">
      <Input {...register('fullName')} placeholder="Full Name" required />
      <Input type="email" {...register('email')} placeholder="Email" required />
      <Input type="password" {...register('password')} placeholder="Password" required />
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
}
