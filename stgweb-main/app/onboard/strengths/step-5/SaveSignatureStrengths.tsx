'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {StrengthIDMap, type StrengthSlug} from '@/lib/strength-data';
import useAuth from '@/hooks/use-auth';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const texts = {
  backToStrengths: {
    'en-US': 'Back to strengths',
    'fi-FI': 'Takaisin vahvuuksiin',
    'sv-SE': 'Tillbaka till styrkor',
  },
  tryAgainButton: {
    'en-US': 'Try again',
    'fi-FI': 'Yritä uudelleen',
    'sv-SE': 'Försök igen',
  },
  continueButton: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätt',
  },
  failedToast: {
    'en-US': 'Failed to save strengths!',
    'fi-FI': 'Vahvuuksien tallentaminen epäonnistui!',
    'sv-SE': 'Misslyckades med att spara styrkor!',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly signatureStrengths: StrengthSlug[];
};

export const SaveSignatureStrengths = (props: Props) => {
  const router = useRouter();
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const {signatureStrengths} = props;
  const {getLoggedInUserId} = useAuth();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      const loggedInUserId = getLoggedInUserId() ?? '';
      const directus = createClientSideDirectusClient();
      await refreshAuthIfExpired();
      const me = await directus.users.me.read();
      if (!me.self_identified_signature_strengths) {
        await directus.items('swl_moment').createOne({
          created_by: loggedInUserId,
          status: 'published',
          swl_item: {
            type: 'moment',
            swl_wall_links: [{swl_wall: me.swl_wall}],
          },
          // NOTE: content for these is empty, since even though they are
          // stored as a moment, they are handled a bit differently (hidden in
          // inbox and content set based on locale for the strength details
          // listing)
          from_strengths_onboarding: true,
          strengths: signatureStrengths.map((slug) => ({
            strength: StrengthIDMap[slug],
          })),
        });
      }

      await directus.items('directus_users').updateOne(loggedInUserId, {
        self_identified_signature_strengths: signatureStrengths.join(','),
      });

      router.push(PATHS.strengthsOnboardingStep6);
    } catch {
      toast.error(t('failedToast', locale));
      setLoading(false);
      setFailed(true);
    }
  };

  const handleGoBack = () => {
    router.push(PATHS.strengthsOnboardingStep3);
  };

  const continueButtonText = failed ? 'tryAgainButton' : 'continueButton';

  return (
    <div className="w-full max-w-xs flex-row space-y-2">
      <ButtonWithLoader
        isLoading={loading}
        className="flex w-full max-w-xs flex-col bg-primary text-white"
        onClick={handleNext}
      >
        {t(continueButtonText, locale)}
      </ButtonWithLoader>

      <button
        type="button"
        className="flex w-full max-w-xs flex-col items-center rounded-full bg-white px-8 py-3 font-bold text-primary"
        onClick={handleGoBack}
      >
        {t('backToStrengths', locale)}
      </button>
    </div>
  );
};
