'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {type UserType} from '@/types/auth';
import {directusClientSideLogin} from '@/lib/directus';
import {cookieDomain} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import {ORG_CONTROLLER_ROLE_ID, PATHS} from '@/constants.mjs';

const LoginForm = () => {
  const cookies = useCookies();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {getLoggedInUserRole} = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await directusClientSideLogin({email, password});
      const role = getLoggedInUserRole();
      if (role !== ORG_CONTROLLER_ROLE_ID) {
        toast.error('Login failed (access denied)');
        setIsLoading(false);
        window.location.href = PATHS.logout;
        return;
      }

      const userType: UserType = 'org-controller-user';
      cookies.set('user_type', userType, {
        expires: 365,
        domain: cookieDomain(),
      });
      router.push('/admin/organizations');
    } catch (error) {
      console.log((error as Error).message);
      toast.error('Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <a href="/" className="mb-4 text-primary">
        Go back to the home page
      </a>
      <form
        className="mx-auto w-full max-w-md border border-gray-300 bg-white p-8"
        onSubmit={handleSubmit}
      >
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="mb-5 w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <>Loading...</> : <>Sign In</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
