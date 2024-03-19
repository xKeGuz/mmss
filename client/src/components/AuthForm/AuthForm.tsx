'use client';
import { HTMLAttributes, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
// import { registerUser } from '@/actions';
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui';
import { Icons } from '..';
import { RegisterUser } from '@/actions';

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {
  isRegister?: boolean;
}

const FormSchema = z.object({
  first_name: z
    .string()
    .min(2, {
      message: 'First name must be at least be 2 characters',
    })
    .optional(),
  middle_name: z
    .string()
    .min(2, {
      message: 'Second name must be at least be 2 characters',
    })
    .optional(),
  last_name: z
    .string()
    .min(2, {
      message: 'First last name must be at least be 2 characters',
    })
    .optional(),
  second_last_name: z
    .string()
    .min(2, {
      message: 'Second last name must be at least be 2 characters',
    })
    .optional(),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export function AuthForm({ className, isRegister, ...props }: Readonly<UserAuthFormProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: isRegister ? '' : undefined,
      middle_name: undefined,
      last_name: isRegister ? '' : undefined,
      second_last_name: undefined,
      email: '',
      password: '',
    },
  });

  const startLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (!signInResult?.ok) {
        return toast.error('Invalid credentials');
      }

      router.replace('/dashboard');
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
      toast.error('An error occurred during login');
    }
  };

  const startRegister = async (data: any) => {
    setIsLoading(true);

    try {
      const user = await RegisterUser(data);
      console.log(user);

      setIsLoading(false);

      if (!user.valid) {
        toast.error(user.message);
        form.setError('email', { message: user.message });
        console.log('user already registered');
        return;
      }

      await startLogin(data.email, data.password);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
      toast.error('An error occurred during registration');
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data;

    if (isRegister) {
      startRegister(data);
    } else {
      startLogin(email, password);
    }
  }

  return (
    <div className="px-8">
      <div className="mx-auto flex w-full h-screen flex-col justify-center space-y-6 sm:w-[370px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center items-center w-full mb-4">
            <Image src="/logo.svg" alt="logo" width={100} height={100} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isRegister ? 'Create your MMSS account' : 'Log In to MMSS'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRegister
              ? 'Enter your email below to create your account'
              : 'Enter your credentials below to continue'}
          </p>
        </div>

        <div className={cn('grid gap-6', className)} {...props}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fisrt Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Fisrt Name" {...field} autoComplete="fisrtName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Second Name" {...field} autoComplete="middle_name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRegister && (
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} autoComplete="last_name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="second_last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter second last name"
                        {...field}
                        autoComplete="second_last_name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email" {...field} autoComplete="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {isRegister ? 'Create account' : 'Login'}
              </Button>
            </form>
          </Form>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div> */}
          {/* <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() =>
              signIn(
                'google',

                { callbackUrl: '/dashboard' }
              )
            }
          >
            {isLoading ? (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.Google className="mr-2 h-4 w-4" />
            )}{' '}
            Google
          </Button> */}
        </div>

        <p className="text-sm text-muted-foreground">
          {isRegister ? 'Already have an account? ' : 'Don’t have an account? '}
          <Link
            href={isRegister ? '/login' : '/register'}
            className="underline underline-offset-4 hover:text-primary"
          >
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </p>

        <p className="text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
