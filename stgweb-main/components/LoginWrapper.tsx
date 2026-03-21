'use client';

import {type ReactNode, useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {PATHS, SUPPORT_EMAIL} from '@/constants.mjs';
import {type UserType} from '@/types/auth';
import {directusClientSideLogin} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {cookieDomain} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useGlobal from '@/hooks/useGlobal';
import {Loader} from '@/components/atomic/atoms/Loader';

const texts = {
  somethingFailed: {
    'en-US': 'Something failed. Contact support at {supportEmail}.',
    'sv-SE': 'Något gick fel. Kontakta supporten på {supportEmail}.',
    'fi-FI':
      'Jotain meni pieleen. Ota yhteys tukeen osoitteessa {supportEmail}.',
  },
  tryAgain: {
    'en-US': 'Try again',
    'sv-SE': 'Försök igen',
    'fi-FI': 'Yritä uudelleen',
  },
  // Add more translations as needed
};

function t(key: string, locale: string) {
  const supportEmail = SUPPORT_EMAIL; // Replace with the actual email address
  return (
    (texts as any)?.[key]?.[locale]?.replace('{SUPPORT_EMAIL}', supportEmail) ||
    'translation-not-found'
  );
}

type Props = {
  readonly children: ReactNode;
  readonly userType: UserType;
};
export const LoginWrapper = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {children, userType} = props;
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(true);
  const router = useRouter();
  const searchParameters = useSearchParams();
  const pathname = usePathname();

  const {setGlobalState} = useGlobal();
  const {isLoggedIn} = useAuth();

  useLegacyEffect(() => {
    const successActions = () => {
      // remove p query params (leave others)
      const email = searchParameters.get('e');
      const role = searchParameters.get('r');
      const query = new URLSearchParams({
        r: role ?? '',
        event: email ?? '',
      });
      cookies.set('user_type', userType, {
        expires: 365,
        domain: cookieDomain(),
      });

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      router.push(`${pathname}?${query}`);
      setLoading(false);
      setFailed(false);
    };

    const failureActions = () => {
      setLoading(false);
      setFailed(true);
    };

    const run = async () => {
      // this might be a leftover from previous session...
      localStorage.removeItem('attemptedToFixSession');

      const email = searchParameters.get('e') ?? '';
      const password = searchParameters.get('p') ?? '';

      const tryingToLogIn = email.trim() !== '' && password.trim() !== '';

      // There's an edge case where user can already be logged in when they come
      // to a page with the LoginWrapper. Running `directusClientSideLogin`
      // again in that case seems to work just fine, so we don't actually have
      // to do anything extra.
      if (isLoggedIn) {
        // const returnPathEnc = encodeURIComponent(`${pathname}?e=${email}&p=${password}`)
        // router.push(`${PATHS.logout}?return=${returnPathEnc}`)
        // return
      }

      // if we are already logged in and not coming in with new credentials,
      // everything should be fine
      if (isLoggedIn && !tryingToLogIn) {
        successActions();
        return;
      }

      // if neither of these are true, user should be redirected away from here
      if (!isLoggedIn && !tryingToLogIn) {
        router.push('/');
        return;
      }

      if (tryingToLogIn) {
        try {
          const authCall = await directusClientSideLogin({
            email,
            password,
          });
          setGlobalState({userAuthToken: authCall.access_token});
        } catch (error) {
          console.log((error as Error).message);
          failureActions();
          return;
        }

        // login succeeded
        successActions();
      }
    };

    run();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (failed) {
    return (
      <div className="max-w-xs p-8 text-center text-white">
        <span>
          {t('somethingFailed', locale).replace(
            '{supportEmail}',
            SUPPORT_EMAIL,
          )}
        </span>
        <div className="mt-4">
          <Link href={PATHS.joinOrganizationStart}>
            {t('tryAgain', locale)}
          </Link>
        </div>
      </div>
    );
  }

  return children;
};
