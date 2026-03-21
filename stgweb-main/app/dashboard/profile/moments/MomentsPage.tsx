'use client';

import {MomentsList} from './MomentsList';
import {MomentInput} from '@/components/MomentInput/MomentInput';
import useDashboard from '@/hooks/useDashboard';
import {type LocaleCode} from '@/lib/locale';

const texts = {
  noMomentsCaption: {
    'en-US': 'See the good in yourself',
    'sv-SE': 'Se det goda i dig själv',
    'fi-FI': 'Huomaa hyvää itsessäsi',
  },
  noMomentsParagraph1: {
    'en-US': 'Document strengths and make your progress visible.',
    'sv-SE': 'Dokumentera era styrkor och gör era framsteg synliga.',
    'fi-FI': 'Dokumentoi vahvuuksia ja tee edistymisenne näkyväksi',
  },
  invalidData: {
    'en-US': 'Invalid data',
    'sv-SE': 'Ogiltiga data',
    'fi-FI': 'Virheellinen sivu',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly moments: any[];
  readonly locale: LocaleCode;
};

export const MomentsPage = (props: Props) => {
  const {moments, locale} = props;
  const {dashboardState} = useDashboard();

  const ownStrengthWallId = dashboardState.userStrengthWallId;

  if (!ownStrengthWallId) {
    return t('invalidData', locale);
  }

  return (
    <section>
      <div className="flex max-w-[980px] flex-col items-start gap-2 md:px-8">
        <div className="mt-12 w-full lg:mt-6">
          <MomentInput
            target="self"
            swlWallId={ownStrengthWallId}
            targetName="myself"
          />
        </div>
        {moments?.length ? (
          <MomentsList moments={moments} />
        ) : (
          <div className="flex w-full flex-col items-center px-8 pt-4 text-center">
            <h2 className="mb-2 mt-6 text-lg font-bold">
              {t('noMomentsCaption', locale)}
            </h2>
            <p className="mb-2 text-base">{t('noMomentsParagraph1', locale)}</p>
          </div>
        )}
      </div>
    </section>
  );
};
