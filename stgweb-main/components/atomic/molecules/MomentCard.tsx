import Image from 'next/image';
import {CreatedAt} from '../atoms/CreatedAt';
import {strengthImageBySlug} from '../atoms/StrengthImage';
import {Avatar} from '../organisms/Avatar';
import {type StrengthPieChartItem} from '../organisms/StrengthPieChart';
import {StrengthFact} from './StrengthFact';
import {type LocaleCode} from '@/lib/locale';
import {
  StrengthColorMap,
  StrengthSlugMap,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import {strengthSlugToReceivedText} from '@/lib/strength-helpers';
import {cn} from '@/lib/utils';
import ClientOnly from '@/components/ClientOnly';

export type MomentCardData = {
  id: string;
  content: string;
  createdAt: string;
  creatorId: string;
  creatorFirstName: string;
  creatorLastName: string;
  creatorAvatar: string;
  creatorAvatarSlug: string;
  creatorColor: string;
  creatorTopStrengths: StrengthPieChartItem[];
  files: Array<{
    id: string;
    width: number;
    height: number;
  }>;
  strengths: string[];
  fromStrengthsOnboarding: boolean;
};

const texts = {
  you: {
    'en-US': 'You',
    'sv-SE': 'Du',
    'fi-FI': 'Sinä',
  },
  sawStrengthInOrgOrGroup: {
    'en-US': '{person} saw {strength}!',
    'sv-SE': '{person} såg {strength}!',
    'fi-FI': '{person} huomasi {strength}!',
  },
  sawStrengthInOther: {
    'en-US': '{person} saw {strength} in you!',
    'sv-SE': '{person} såg {strength} i dig!',
    'fi-FI': '{person} huomasi {strength} sinussa!',
  },
  sawStrengthSelf: {
    'en-US': 'You saw {strength} in yourself!',
    'sv-SE': 'Du såg {strength} i dig själv!',
    'fi-FI': 'Huomasit {strength} itsessäsi!',
  },
  removedUser: {
    'en-US': 'Removed user',
    'sv-SE': 'Borttagen användare',
    'fi-FI': 'Poistettu käyttäjä',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly moment: MomentCardData;
  readonly target: 'self' | 'other' | 'group' | 'org';
  readonly locale: LocaleCode;
  readonly loggedInUserId?: string;
  // needed to access image for logged in users
  readonly authToken?: string;
  // needed to access image from /peek/moment path
  readonly peekAccessToken?: string;
  // eslint-disable-next-line react/boolean-prop-naming
  readonly showFullCardIfStrengthOnly?: boolean;
};

export const MomentCard = (props: Props) => {
  const {
    moment,
    target,
    locale,
    loggedInUserId,
    authToken,
    peekAccessToken,
    showFullCardIfStrengthOnly,
  } = props;

  // this is not optimal, but as long as we don't have a way to properly remove
  // users, this will do
  const creatorRemoved = !moment.creatorFirstName;

  let name = t('you', locale);
  if (moment.creatorId !== loggedInUserId) {
    name = `${moment.creatorFirstName} ${moment.creatorLastName}`;
  }

  if (creatorRemoved) {
    name = t('removedUser', locale);
  }

  const hasImages = moment.files && moment.files.length > 0;
  const hasContent = Boolean(moment.content);
  const strengthOnly = !hasImages && !hasContent;

  const firstStrengthSlug = StrengthSlugMap[moment.strengths[0]];

  let imageUrl = '/images/misc/placeholder-image.png';
  if (hasImages) {
    if (authToken) {
      imageUrl = `/data-api/assets/${moment.files[0].id}?access_token=${authToken}`;
    }

    if (peekAccessToken) {
      imageUrl = `/utils/image-by-token?uuid=${moment.files[0].id}&token=${peekAccessToken}`;
    }
  }

  const strengthOnlyTextTranslationId = {
    org: 'sawStrengthInOrgOrGroup',
    group: 'sawStrengthInOrgOrGroup',
    self: 'sawStrengthSelf',
    other: 'sawStrengthInOther',
  }[target || 'org'];

  const createdAtDate = new Date(moment.createdAt);

  const onlyOneStrength = moment.strengths.length === 1;

  return (
    <div className="max-h-50 w-full border border-x-0 border-gray-300 sm:rounded-lg sm:border">
      <div className="mb-6 flex items-center justify-between px-4 pt-4">
        <div className="flex items-center space-x-2">
          <Avatar
            size={48}
            avatarFileId={creatorRemoved ? undefined : moment.creatorAvatar}
            avatarSlug={creatorRemoved ? undefined : moment.creatorAvatarSlug}
            color={moment.creatorColor}
            strengths={creatorRemoved ? undefined : moment.creatorTopStrengths}
            name={name}
          />
          <span className="font-bold">{name}</span>
          {/* well this is dumb, but the server complains about the "title" for
          the createdAt item even though it's exactly the same as server... */}
          <ClientOnly>
            <>
              <span className="text-gray-400">•</span>
              <CreatedAt createdAtDate={createdAtDate} locale={locale} />
            </>
          </ClientOnly>
        </div>
      </div>
      {moment.content && (
        <div
          className={cn(
            'px-4 pb-4 text-2xl font-semibold',
            moment.content.length > 40 && 'text-lg font-normal',
            moment.content.length > 100 && 'text-base font-normal',
          )}
        >
          {moment.content}
        </div>
      )}
      {moment.files?.[0] && (
        <div>
          {}
          <Image
            src={imageUrl}
            alt="Moment image"
            width={moment.files[0].width}
            height={moment.files[0].height}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      )}
      {strengthOnly && showFullCardIfStrengthOnly && onlyOneStrength ? (
        <>
          <div className="px-4 pb-4 text-2xl font-semibold">
            {t(strengthOnlyTextTranslationId, locale)
              .replace('{person}', moment.creatorFirstName ?? '')
              .replace(
                '{strength}',
                strengthSlugToReceivedText(
                  firstStrengthSlug,
                  locale,
                ).toLowerCase(),
              )}
          </div>
          <StrengthFact slug={firstStrengthSlug} locale={locale} />
        </>
      ) : (
        <div className="mt-4 px-4 pb-4">
          <div className="flex flex-row items-center">
            <div
              className="mr-3 flex w-12 cursor-pointer justify-center rounded-full"
              style={{
                backgroundColor: StrengthColorMap[firstStrengthSlug][300],
              }}
            >
              <Image
                src={strengthImageBySlug(firstStrengthSlug)}
                alt={StrengthTranslationMap[firstStrengthSlug][locale]}
              />
            </div>
            {moment.strengths.map((strengthId: string, idx: number) => (
              <span
                key={`${moment.id}-${strengthId}`}
                className="mr-1.5 text-xs text-gray-600"
              >
                {StrengthTranslationMap[StrengthSlugMap[strengthId]][locale]}
                {idx !== moment.strengths.length - 1 && ','}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
