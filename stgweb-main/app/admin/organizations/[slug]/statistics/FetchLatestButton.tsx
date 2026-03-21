'use client';

import {useState} from 'react';
import {useParams} from 'next/navigation';
import toast from 'react-hot-toast';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

export const FetchLatestButton = () => {
  const parameters = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await refreshAuthIfExpired();
      const directus = createClientSideDirectusClient();
      const orgQuery = await directus.items('organization').readByQuery({
        filter: {
          slug: {
            _eq: parameters.slug,
          },
        },
        limit: 1,
      });
      const org = orgQuery?.data?.[0] as any;
      console.log(org);
      if (org) {
        const call = await fetch(
          `/utils/create-org-time-series-data?orgId=${org.id}`,
          {
            method: 'POST',
          },
        );
        if (!call.ok) {
          const body = await call.json();
          throw new Error(body.message || 'unknown');
        }
      } else {
        throw new Error('org not found');
      }
    } catch {
      setIsLoading(false);
      toast.error('failed');
      return;
    }

    // toast.success("fetched latest")
    // setIsLoading(false)
    window.location.reload();
  };

  return (
    <>
      <p>
        Data is normally fetched once per day (at night). If you need more up to
        date data, you can click here. Keep in mind that this can be somewhat of
        a heavy operation depending on the size of the organization, so
        don&apos;t overdo it...
      </p>
      <ButtonWithLoader
        isLoading={isLoading}
        className="mb-8 mt-4"
        onClick={handleClick}
      >
        Fetch latest data
      </ButtonWithLoader>
    </>
  );
};
