'use client';

import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {cn, objectToUrlSafeBase64} from '@/lib/utils';
import useAnalytics from '@/hooks/useAnalytics';
import useDashboard from '@/hooks/useExample';
import {PeopleIcon} from '@/components/atomic/atoms/PeopleIcon';
import {PersonIcon} from '@/components/atomic/atoms/PersonIcon';
import {Avatar} from '@/components/atomic/organisms/Avatar';

const texts = {
  selfText: {
    'en-US': 'I saw good in',
    'sv-SE': 'Jag såg något bra i',
    'fi-FI': 'Huomasin hyvää',
  },
  colleagueText: {
    'en-US': 'I saw good in my',
    'sv-SE': 'Jag såg något bra hos min',
    'fi-FI': 'Huomasin hyvää',
  },
  groupText: {
    'en-US': 'I saw good in my',
    'sv-SE': 'Jag såg något bra i min',
    'fi-FI': 'Huomasin hyvää',
  },
  myselfText: {
    'en-US': 'myself',
    'sv-SE': 'mig själv',
    'fi-FI': 'itsessäni',
  },
  colleagueTargetText: {
    'en-US': 'colleague',
    'sv-SE': 'kollega',
    'fi-FI': 'kollegassani',
  },
  groupTargetText: {
    'en-US': 'group',
    'sv-SE': 'grupp',
    'fi-FI': 'ryhmässäni',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type CardProps = {
  readonly text: string;
  readonly target: string;
  readonly theme: 'green' | 'yellow' | 'red';
};

const CardButton = ({text, target, theme}: CardProps) => {
  const {dashboardState} = useDashboard();
  let lighterColor = '';
  let darkerColor = '';
  if (theme === 'green') {
    lighterColor = '#ddf1f0';
    darkerColor = '#a5d7d5';
  }

  if (theme === 'yellow') {
    lighterColor = '#ffefbe';
    darkerColor = '#fdd662';
  }

  if (theme === 'red') {
    lighterColor = '#ffdbd9';
    darkerColor = '#f5a6a3';
  }

  return (
    <div
      className={cn(
        'm-5 flex h-60 w-60 flex-col items-center justify-end rounded-lg p-4 sm:m-2',
      )}
      style={{
        backgroundColor: lighterColor,
      }}
    >
      <div
        className={cn(
          'mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4',
        )}
        style={{
          backgroundColor: '#fff',
          borderColor: darkerColor,
        }}
      >
        <div
          className={cn(theme !== 'green' && 'w-12')}
          style={{color: darkerColor}}
        >
          {
            {
              green: (
                <Avatar
                  imageSizeMultiplier={1}
                  avatarFileId={dashboardState.userAvatar}
                  avatarSlug={dashboardState.userAvatarSlug}
                  color={dashboardState.userColor}
                  strengths={dashboardState.userTopStrengths}
                  name={`${dashboardState.userFirstName} ${dashboardState.userLastName}`}
                />
              ),
              yellow: <PersonIcon />,
              red: <PeopleIcon />,
            }[theme]
          }
        </div>
      </div>
      <div
        className={cn(
          'mb-2 mt-4 w-full rounded-full px-2 py-1 text-center text-gray-800',
        )}
        style={{
          backgroundColor: darkerColor,
        }}
      >
        {text} <strong>{target}</strong>
      </div>
    </div>
  );
};

export const Buttons = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const router = useRouter();
  const {recordEvent} = useAnalytics();
  const {dashboardState} = useDashboard();

  const handleClick = (event: any, href: string, target: string) => {
    event.preventDefault();
    const query = new URLSearchParams();
    switch (target) {
      case 'self': {
        query.append(
          'target-data',
          objectToUrlSafeBase64({
            name: dashboardState.userFirstName,
            avatar: dashboardState.userAvatar,
            avatarSlug: dashboardState.userAvatarSlug,
            color: dashboardState.userColor,
            topStrengths: dashboardState.userTopStrengths,
          }),
        );
        recordEvent('seethegood:pick_self');
        break;
      }

      case 'other': {
        recordEvent('seethegood:pick_other');
        break;
      }

      case 'org': {
        query.append(
          'target-data',
          objectToUrlSafeBase64({
            name: dashboardState.userActiveOrganizationName,
            swlId: dashboardState.userActiveOrganizationStrengthWallId,
            isOrg: true,
          }),
        );
        recordEvent('seethegood:pick_org');
        break;
      }

      default:
    }

    query.append('target', target);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    router.push(`${href}?${query}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={(event: any) => {
          handleClick(event, PATHS.seeTheGoodModalPickStrength, 'self');
        }}
      >
        <CardButton
          theme="green"
          text={t('selfText', locale)}
          target={t('myselfText', locale)}
        />
      </button>
      <button
        type="button"
        onClick={(event: any) => {
          handleClick(event, PATHS.seeTheGoodModalPickUser, 'other');
        }}
      >
        <CardButton
          theme="yellow"
          text={t('colleagueText', locale)}
          target={t('colleagueTargetText', locale)}
        />
      </button>
      <button
        type="button"
        onClick={(event: any) => {
          handleClick(event, PATHS.seeTheGoodModalPickStrength, 'org');
        }}
      >
        <CardButton
          theme="red"
          text={t('groupText', locale)}
          target={t('groupTargetText', locale)}
        />
      </button>
      <div className="p-8" />
    </>
  );
};
