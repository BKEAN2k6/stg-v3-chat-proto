'use client';

import {type ReactNode, useState} from 'react';
import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import {validatePassword} from '@/lib/validation';

type PasswordCheckProps = {
  readonly id: string;
  readonly children: ReactNode;
  readonly password: string;
  readonly validClassName?: string;
  readonly invalidClassName?: string;
};

const texts = {
  passwordPlaceholder: {
    'en-US': 'Password',
    'sv-SE': 'Lösenord',
    'fi-FI': 'Salasana',
  },
  yourPasswordMustBeAtLeast: {
    'en-US': 'Your password must be at least',
    'sv-SE': 'Ditt lösenord måste vara minst',
    'fi-FI': 'Salasanassasi on oltava vähintään',
  },
  characters: {
    'en-US': 'characters',
    'sv-SE': 'tecken',
    'fi-FI': 'merkkiä',
  },
  includingA: {
    'en-US': 'including a',
    'sv-SE': 'inklusive en',
    'fi-FI': 'sisältäen vähintään yhden',
  },
  lowercase: {
    'en-US': 'lower-case letter',
    'sv-SE': 'gemener bokstav',
    'fi-FI': 'pienen kirjaimen',
  },
  an: {
    'en-US': 'an',
    'sv-SE': 'en',
    'fi-FI': 'yhden',
  },
  and: {
    'en-US': 'and',
    'sv-SE': 'och',
    'fi-FI': 'ja',
  },
  uppercase: {
    'en-US': 'upper-case letter',
    'sv-SE': 'versaler bokstav',
    'fi-FI': 'ison kirjaimen',
  },
  number: {
    'en-US': 'number',
    'sv-SE': 'siffra',
    'fi-FI': 'numeron',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const PasswordCheck = (props: PasswordCheckProps) => {
  const {id, password, children} = props;
  const validClassName = props.validClassName ?? 'text-green-800';
  const invalidClassName = props.invalidClassName ?? 'text-red-800';

  let className = invalidClassName;
  const invalidPasswordReasons = validatePassword(password, true) as string[];
  if (!invalidPasswordReasons.includes(id)) {
    className = validClassName;
  }

  return <span className={className}>{children}</span>;
};

type Props = {
  readonly password: string;
  readonly isInvalidPassword: boolean;
  readonly handlePasswordChange: (x: any) => void;
  readonly passwordInstructionsClassName?: string;
  readonly passwordCheckValidClassName?: string;
  readonly passwordCheckInvalidClassName?: string;
};

export const PasswordInput = (props: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {
    isInvalidPassword,
    password,
    handlePasswordChange,
    passwordInstructionsClassName,
    passwordCheckValidClassName,
    passwordCheckInvalidClassName,
  } = props;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <div className="relative">
        <input
          className={cn(
            'form-control h-12 w-full rounded border text-center font-mono text-md',
            isInvalidPassword && 'border-red-800',
          )}
          type={isPasswordVisible ? 'text' : 'password'} // Toggle type based on state
          id="password"
          value={password}
          placeholder={t('passwordPlaceholder', locale)}
          onChange={(event) => {
            handlePasswordChange(event);
          }}
        />
        <span
          className="absolute right-3 top-3 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? '🙈' : '👁'}
        </span>
      </div>
      <div className="my-4 max-w-sm">
        <p className={cn('text-xs', passwordInstructionsClassName)}>
          {t('yourPasswordMustBeAtLeast', locale)}{' '}
          <PasswordCheck
            id="12-characters"
            password={password}
            validClassName={passwordCheckValidClassName}
            invalidClassName={passwordCheckInvalidClassName}
          >
            12 {t('characters', locale)}
          </PasswordCheck>{' '}
          {t('includingA', locale)}{' '}
          <PasswordCheck
            id="at-least-1-lowercase"
            password={password}
            validClassName={passwordCheckValidClassName}
            invalidClassName={passwordCheckInvalidClassName}
          >
            {' '}
            {t('lowercase', locale)}
          </PasswordCheck>
          , {t('an', locale)}{' '}
          <PasswordCheck
            id="at-least-1-uppercase"
            password={password}
            validClassName={passwordCheckValidClassName}
            invalidClassName={passwordCheckInvalidClassName}
          >
            {t('uppercase', locale)}
          </PasswordCheck>
          , {t('and', locale)} {t('an', locale)}{' '}
          <PasswordCheck
            id="at-least-1-number"
            password={password}
            validClassName={passwordCheckValidClassName}
            invalidClassName={passwordCheckInvalidClassName}
          >
            {t('number', locale)}
          </PasswordCheck>
          .
        </p>
      </div>
    </>
  );
};
