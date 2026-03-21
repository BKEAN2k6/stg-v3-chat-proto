'use client';

import {useRouter} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {type LocaleCode} from '@/lib/locale';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const texts = {
  clearSession: {
    'en-US': 'Join another group or log in',
    'sv-SE': 'Gå med i en annan grupp eller logga in',
    'fi-FI': 'Liity toiseen ryhmään tai kirjaudu sisään',
  },
  confirmClearSession: {
    'en-US': "Are you sure, you won't be able to access the sprint again?",
    'sv-SE':
      'Är du säker på att du inte kommer att kunna komma åt sprinten igen?',
    'fi-FI': 'Oletko varma? Et voi palata tähän vahvuustuokioon uudelleen.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly locale: LocaleCode;
};

export const ClearSessionButton = (props: Props) => {
  const {locale} = props;
  const router = useRouter();

  const handleClearSession = () => {
    // eslint-disable-next-line no-alert
    if (confirm(t('confirmClearSession', locale))) {
      router.push(PATHS.logout);
    }
  };

  return (
    <ButtonWithLoader className="w-full max-w-sm" onClick={handleClearSession}>
      {t('clearSession', locale)}
    </ButtonWithLoader>
  );
};
