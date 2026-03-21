'use client';

import {OwnStrengthsCarousel} from './OwnStrengthsCarousel';
import {shuffledAndPaddedStrengthSlugs} from '@/lib/strength-helpers';
import ClientOnly from '@/components/ClientOnly';

type Parameters_ = {
  readonly sessionId: string;
};

export const OwnStrengthsPage = ({sessionId}: Parameters_) => (
  //
  <>
    <ClientOnly>
      <OwnStrengthsCarousel
        items={shuffledAndPaddedStrengthSlugs().map((slug) => ({
          data: {slug},
          isPlaceholder: false,
        }))}
        sessionId={sessionId}
      />
    </ClientOnly>
    <div className="h-10" />
  </>
);
