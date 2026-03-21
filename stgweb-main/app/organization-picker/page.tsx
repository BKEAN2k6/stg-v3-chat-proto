'use client';

import {useCookies} from 'next-client-cookies';
import {useState} from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {getLocaleCode, transformTranslations} from '@/lib/locale';
import {PATHS} from '@/constants.mjs';
import {Loader} from '@/components/atomic/atoms/Loader';
import {refreshAuthIfExpired} from '@/lib/directus';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {getInitials} from '@/lib/utils';

const texts = {
  failedToFetchOrganizations: {
    'en-US': 'Failed to fetch organizations',
    'fi-FI': 'Organisaatioiden haku epäonnistui',
    'sv-SE': 'Misslyckades med att hämta organisationer',
  },
  failedToPickOrganization: {
    'en-US': 'Failed to pick organization',
    'fi-FI': 'Organisaation valitseminen epäonnistui',
    'sv-SE': 'Misslyckades med att välja organisation',
  },
  select: {
    'en-US': 'Select',
    'fi-FI': 'Valitse',
    'sv-SE': 'Välj',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type OrganizationListItem = {
  id: string;
  name: Record<string, string>;
  avatar?: string;
  color?: string;
};

type WrapperProps = {
  readonly children: React.ReactNode;
};

const Wrapper = (props: WrapperProps) => {
  const {children} = props;
  return (
    <div className="min-safe-h-screen w-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex flex-col justify-center bg-primary-darker-1 text-center">
          <div className="px-4 py-8">{children}</div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
};

const OrganizationPicker = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [isFetching, setIsFetching] = useState(false);
  const [failedToFetch, setFailedToFetch] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>(
    [],
  );

  const handlePickOrganization = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    organizationId: string,
  ) => {
    if (isSwitching) return;
    event.preventDefault();
    setIsSwitching(true);
    try {
      await refreshAuthIfExpired({force: true});
      const call = await fetch(PATHS.switchOrganization, {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
        }),
      });
      if (!call.ok) {
        const body = await call.json();
        throw new Error(body.message || 'unknown');
      }
    } catch {
      setIsSwitching(false);
      toast.error(t('failedToPickOrganization', locale), {
        id: 'unknown-error',
      });
    }

    window.location.href = PATHS.community;
  };

  useLegacyEffect(() => {
    const run = async () => {
      setIsFetching(true);
      try {
        await refreshAuthIfExpired({force: true});
        const call = await fetch(PATHS.getOwnOrganizationLinks, {
          method: 'GET',
        });
        if (!call.ok) {
          const body = await call.json();
          throw new Error(body.message || 'unknown');
        }

        const body = await call.json();
        const ownOrganizationLinks = body.data;

        setOrganizations(
          ownOrganizationLinks.map((orgLink: any) => ({
            id: orgLink.organization.id,
            ...transformTranslations(orgLink.organization.translation),
            color: orgLink.organization.color,
            avatar: orgLink.organization.avatar,
          })),
        );
      } catch {
        setIsFetching(false);
        setFailedToFetch(true);
        return;
      }

      setIsFetching(false);
    };

    run();
  }, []);

  if (isFetching || isSwitching) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center px-4">
          <Loader />
        </div>
      </Wrapper>
    );
  }

  if (failedToFetch) {
    return <Wrapper>{t('failedToFetchOrganizations', locale)}</Wrapper>;
  }

  return (
    <Wrapper>
      <div className="flex flex-wrap items-center justify-center">
        {organizations.map((organization) => {
          const hasAvatar = Boolean(organization.avatar);
          const initials = getInitials(organization.name[locale]);
          return (
            <a
              key={`org-${organization.id}`}
              href="#"
              className="mx-12 mb-12 flex flex-col items-center"
              onClick={async (event) =>
                handlePickOrganization(event, organization.id)
              }
            >
              <div
                className="bg-primary-darker-2 mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border"
                style={{backgroundColor: organization.color ?? '#666'}}
              >
                {hasAvatar && organization.avatar ? (
                  <Image
                    src={organization.avatar}
                    alt={`${organization.name[locale]} avatar`}
                    className="h-16 w-16 rounded-full"
                  />
                ) : (
                  <span className="-mb-1 text-lg font-bold text-white">
                    {initials}
                  </span>
                )}
              </div>
              <div className="mb-2 min-w-[120px] max-w-[120px] text-md font-bold text-white">
                {organization.name[locale]}
              </div>
              <span className="text-tertiary-a-300">{t('select', locale)}</span>
            </a>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default OrganizationPicker;
