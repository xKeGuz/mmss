import { Metadata } from 'next';
import { AuthForm } from '@/components';

export const metadata: Metadata = {
  title: 'MMSS - Login',
  description: 'MMSS software login page',
};

export default function Login() {
  return <AuthForm />;
}
