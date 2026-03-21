'use client';

import {useState} from 'react';
import {Carousel} from '../Carousel';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {Loader} from '@/components/atomic/atoms/Loader';

type CarouselItem = {
  data: {
    name: string;
    swlId: string;
  };
  isPlaceholder?: boolean;
};

// NOTE: this is a bit different from the strength carousel, as we don't get any
// state from the page, but instead build it here.
export const SeeTheGoodUserCarousel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<CarouselItem[]>([]);
  const {getLoggedInUserId} = useAuth();

  useLegacyEffect(() => {
    const run = async () => {
      await refreshAuthIfExpired();
      const directus = createClientSideDirectusClient();
      const users = await directus.items('directus_users').readByQuery({
        filter: {
          _and: [
            {
              first_name: {
                _nnull: true,
              },
            },
            {
              swl_wall: {
                _nnull: true,
              },
            },
            {
              is_strength_session_user: {
                _null: true,
              },
            },
          ],
        },
        limit: -1,
      });
      const newUsers: CarouselItem[] =
        users.data
          ?.filter((user: any) => user.id !== getLoggedInUserId())
          .map((user: any) => ({
            data: {
              id: user.id,
              name: user.first_name,
              swlId: user.swl_wall,
              ...(user.top_strengths && {topStrengths: user.top_strengths}), // prettier-ignore
              ...(user.avatar && {avatar: user.avatar}),
              ...(!user.avatar && user.avatar_slug && {avatarSlug: user.avatar_slug}), // prettier-ignore
              ...(!user.avatar && user.avatar_slug && user.color && {color: user.color}), // prettier-ignore
            },
          })) ?? [];
      // This odd looking logic exists to make sure we always get 9 items in the
      // carousel, so that the library used to render the slides gets enough
      // pages to render the slider properly. The ones that are not "real", are
      // marked as placeholders. This isn't the correct place to have this
      // logic, but since the slider thing overall was still kind of looking for
      // it's final form while this was being built, it was easier to do things
      // like this instead of adding more complexity to the slider components.
      if (newUsers.length < 9) {
        for (let idx = newUsers.length; idx < 9; idx += 1) {
          newUsers.push({data: {name: '', swlId: ''}, isPlaceholder: true});
        }
      }

      setItems(newUsers);
      setIsLoading(false);
    };

    run();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-28 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <Carousel type="user" items={items} />;
};
