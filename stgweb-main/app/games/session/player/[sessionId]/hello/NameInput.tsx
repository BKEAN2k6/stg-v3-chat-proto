'use client';
import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';
import {
  latinAlphabetWithSpecials,
  spaceAndDash,
  validateAndNormalizeInput,
} from '@/lib/validation';

const texts = {
  namePlaceholder: {
    'en-US': 'Name',
    'fi-FI': 'Nimi',
    'sv-SE': 'Namn',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly name: string;
  readonly setName: (names: string) => void;
};

export const NameInput = (props: Props) => {
  const {name, setName} = props;
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(
      validateAndNormalizeInput(
        event.target.value,
        `${latinAlphabetWithSpecials}${spaceAndDash}`,
      ),
    );
  };

  return (
    <input
      autoFocus
      className="form-control h-16 w-full rounded border text-center font-mono text-xl font-bold"
      type="text"
      id="name"
      value={name}
      placeholder={t('namePlaceholder', locale)}
      maxLength={50}
      onChange={(event) => {
        handleNameChange(event);
      }}
    />
  );
};
