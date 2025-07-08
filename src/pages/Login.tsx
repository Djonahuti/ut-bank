import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) navigate('/dashboard');
    else alert('Invalid credentials');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto mt-20 space-y-4"
    >
      <Input {...register('email')} placeholder="Email" type="email" required />
      <Input {...register('password')} placeholder="Password" type="password" required />
      <Button type="submit" className="w-full">
        Login
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Don't have an account? <a href="/signup" className="text-blue-600">Sign Up</a>
      </p>
    </form>
  );
}
