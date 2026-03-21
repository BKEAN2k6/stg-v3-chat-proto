'use client';

import Image from 'next/image';
import {useState} from 'react';
import {type LocaleCode} from '@/lib/locale';
import {Loader} from '@/components/atomic/atoms/Loader';

type Props = {
  readonly targetLocale: LocaleCode;
  readonly target: string;
  readonly languageName: string;
  readonly chooseText: string;
  readonly flagFile: string;
  readonly flagAlt: string;
};

export const LanguageButton = (props: Props) => {
  const {targetLocale, target, languageName, chooseText, flagFile, flagAlt} =
    props;
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <a
      href={`/utils/set-locale/${targetLocale}?target=${encodeURIComponent(
        target,
      )}`}
      className="flex flex-col items-center"
      onClick={() => {
        handleClick();
      }}
    >
      <div
        className="flex items-center justify-center rounded-full bg-white p-4"
        style={{width: '150px', height: '150px'}}
      >
        {/* NOTE: looks a bit weird due to conflict with expected intendation with two different lint rules */}
        {isLoading ? (
          <Loader />
        ) : (
          <Image src={flagFile} alt={flagAlt} width={70} height={70} />
        )}
      </div>
      <p className="mt-4 text-lg">{languageName}</p>
      <p className="mt-2 text-xs text-tertiary-a-300">{chooseText}</p>
    </a>
  );
};
