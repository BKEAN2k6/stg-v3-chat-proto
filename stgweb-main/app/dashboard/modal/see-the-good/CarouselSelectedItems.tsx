'use client';

import {
  type ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import {StrengthIconAndName} from '@/components/atomic/molecules/StrengthIconAndName';
import {UserAvatarAndName} from '@/components/atomic/molecules/UserAvatarAndName';
import useCarousel from '@/components/carousel/useCarousel';
import Confetti1 from '@/components/draft/confetti-1';
import useElementPosition from '@/components/draft/use-element-position';

// @REFACTORING: this is quite a hack...
const wrapperClasses = cn(
  'items-center',
  'max-w-[60px]',
  'md:max-w-[70px]',
  'lg:max-w-[80px]',
  // same as the strength-icons / avatar-images...
  'h-[60px] w-[60px]',
  'md:h-[70px] md:w-[70px]',
  'lg:h-[80px] lg:w-[80px]',
);

const texts = {
  user: {
    'en-US': 'Person',
    'sv-SE': 'Person',
    'fi-FI': 'Henkilö',
  },
  strength: {
    'en-US': 'Strength',
    'sv-SE': 'Styrka',
    'fi-FI': 'Vahvuus',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const SelectedItemPlaceholder = (props: {readonly type: string}) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {type} = props;
  return (
    <div className={wrapperClasses}>
      <div className="mb-4 box-border h-full rounded-full border-2 border-dashed border-gray-300" />
      <div className="h-12 max-w-[80px] text-center text-xs sm:text-sm md:text-sm lg:text-sm">
        {t(type, locale)}
      </div>
    </div>
  );
};

type SelectedItemProps = {
  readonly children: ReactNode;
  readonly isVisible: boolean;
};

const SelectedItem = forwardRef(
  ({children, isVisible}: SelectedItemProps, ref: any) => {
    const {position, elementRef} = useElementPosition();
    const [shouldPop, setShouldPop] = useState(false);

    useEffect(() => {
      setShouldPop(true);
    }, []);

    if (!ref?.current) {
      return children;
    }

    return (
      <div ref={elementRef} className={wrapperClasses}>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{opacity: 0, scale: 0}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0}}
              transition={{duration: 0.3, ease: 'backInOut'}}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {shouldPop && <Confetti1 x={position.x / 100} y={position.y / 100} />}
      </div>
    );
  },
);

export const SeeTheGoodSelectedItems = () => {
  const {selectedUserData, selectedStrengthSlug} = useCarousel();
  const animateSelectedItemsRef = useRef(false);

  const SelectedUser = useMemo(() => {
    if (!selectedUserData) {
      return <SelectedItemPlaceholder type="user" />;
    }

    return (
      <SelectedItem ref={animateSelectedItemsRef} isVisible>
        <UserAvatarAndName
          name={selectedUserData.name}
          avatarFileId={selectedUserData.avatar}
          avatarSlug={selectedUserData.avatarSlug}
          color={selectedUserData.color}
          strengths={selectedUserData.topStrengths}
          size="sm"
          textWrapperClassName="text-xs sm:text-sm md:text-sm lg:text-sm"
        />
      </SelectedItem>
    );
  }, [selectedUserData]);

  const SelectedStrength = useMemo(() => {
    if (!selectedStrengthSlug) {
      return <SelectedItemPlaceholder type="strength" />;
    }

    return (
      <SelectedItem ref={animateSelectedItemsRef} isVisible>
        <StrengthIconAndName
          slug={selectedStrengthSlug}
          size="sm"
          textWrapperClassName="text-xs sm:text-sm md:text-sm lg:text-sm"
        />
      </SelectedItem>
    );
  }, [selectedStrengthSlug]);

  // const isSelf = useMemo(() => {
  //   return (
  //     carouselState.seeTheGoodSelectedStrengthWallId ===
  //     dashboardState.userStrengthWallId
  //   )
  // }, [
  //   carouselState.seeTheGoodSelectedStrengthWallId,
  //   dashboardState.userStrengthWallId,
  // ])

  // make it so we only animate after the first page load (so preselected items
  // don't get animated)
  useEffect(() => {
    setTimeout(() => {
      animateSelectedItemsRef.current = true;
    }, 100);
  }, []);

  return (
    <div className="mb-16 flex h-24 justify-center space-x-8 sm:mt-20 md:h-28 lg:h-32">
      <div className={wrapperClasses}>{SelectedUser}</div>
      <div className={wrapperClasses}>{SelectedStrength}</div>
    </div>
  );
};
