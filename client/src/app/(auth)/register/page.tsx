import { AuthForm } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MMSS - Register',
  description: 'MMSS software register page',
};

export default function Register() {
  return <AuthForm isRegister />;
}
