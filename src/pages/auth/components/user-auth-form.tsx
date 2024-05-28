import { HTMLAttributes, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { PasswordInput } from '@/components/custom/password-input';
import { cn } from '@/lib/utils';
import { ILoginRequest } from '@/models/auth';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getUserInfo, login } from '@/redux/features/authSlice';
import { RequestStatus } from '@/utils/enums';

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogin = useCallback(
    async (payload: ILoginRequest) => dispatch(login(payload)).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const fetchuserInfo = useCallback(
    async () => dispatch(getUserInfo()).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // const fetchShopInfo = useCallback(
  //   async (shopId: string) => dispatch(getShopDetails(shopId)).unwrap(),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [],
  // );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    onLogin(data.email, data.password);
  }

  const onLogin = async (email: string, password: string) => {
    try {
      const payload = {
        email,
        password,
      };
      const response = await handleLogin(payload);
      localStorage.setItem('accessToken', response.data.accessToken);
      const userInfo = await fetchuserInfo();

      console.log(userInfo);

      navigate(`/`);
    } catch (error) {
      console.log(error);
    }
  };
  if (authState.asyncStatus === RequestStatus.Success) {
    return (
      <Navigate
        to={`/`}
        // state={{ from: location }}
      />
    );
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Login
            </Button>

            {/* <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGithub className='h-4 w-4' />}
              >
                GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandFacebook className='h-4 w-4' />}
              >
                Facebook
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
