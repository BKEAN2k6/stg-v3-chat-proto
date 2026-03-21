'use client';

import {useState} from 'react';
import Image from 'next/image';
import {StrengthSessionDialog} from './StrengthSessionDialog';
import lessonMaterialImage from '@/public/images/misc/lesson-material.png';
import strengthSessionImage from '@/public/images/misc/strength-session.png';
import {type LocaleCode} from '@/lib/locale';

const texts = {
  all: {
    'en-US': 'All',
    'sv-SE': 'Alla',
    'fi-FI': 'Kaikille',
  },
  ages: {
    'en-US': 'Ages',
    'sv-SE': 'Åldrarna',
    'fi-FI': 'Iät',
  },
  strengthSessionCaption: {
    'en-US': 'Strength sprint',
    'sv-SE': 'Styrkesprint',
    'fi-FI': 'Vahvuustuokio',
  },
  strengthSessionDescription: {
    'en-US':
      'Practice seeing the good together with the whole class in this short sprint filled with strengths.',
    'sv-SE':
      'Öva på att se det som är bra tillsammans med hela klassen i denna korta sprint fylld med styrkor.',
    'fi-FI':
      'Harjoittele vahvuuksien huomaamista yhdessä koko luokan kanssa lyhyellä vahvuustuokiolla.',
  },
  lessonMaterialAndCardsCaption: {
    'en-US': 'Lesson material & strength cards',
    'sv-SE': 'Lektionsmaterial & styrkekort',
    'fi-FI': 'Oppimateriaali & vahvuuskortit',
  },
  lessonMaterialAndCardsDescription: {
    'en-US':
      'This is our tried and true lesson material for teachers looking for detailed lesson plans to use with their class.',
    'sv-SE':
      'Detta är vårt beprövade lektionsmaterial för pedagoger som letar efter detaljerade lektionsplaner att använda med sin klass.',
    'fi-FI':
      'Tämä on hyväksi havaittu oppituntimateriaalimme opettajille, jotka etsivät yksityiskohtaisia oppituntisuunnitelmia luokkansa kanssa käytettäväksi.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type V1LessonMaterialProps = {
  readonly locale: string;
};

export const V1LessonMaterial = (props: V1LessonMaterialProps) => {
  const {locale} = props;

  return (
    <div className="max-w-2xl">
      <a
        href="https://go.seethegood.app/kfk3832ngvdsQoerhA938Gr/learn/students-v2"
        rel="noreferrer"
        target="_blank"
        className="relative flex flex-col items-stretch rounded-lg border border-gray-200 bg-gray-50 p-2 sm:flex-row"
      >
        <div className="relative mb-2 flex shrink-0 justify-center sm:mb-0">
          <Image
            src={lessonMaterialImage}
            alt=""
            className="h-36 w-36 rounded-lg object-cover pr-0 sm:pr-2"
          />
          <span className="absolute left-2 top-2 rounded-full bg-white p-2 px-4 py-1 text-sm text-gray-800 opacity-80 sm:bottom-2 sm:top-auto">
            {t('all', locale)}
          </span>
        </div>
        <div className="flex flex-1 flex-col rounded-lg bg-white p-8">
          <div className="mb-2 text-lg font-bold">
            {t('lessonMaterialAndCardsCaption', locale)}
          </div>
          <div>{t('lessonMaterialAndCardsDescription', locale)}</div>
        </div>
      </a>
    </div>
  );
};

type StrengthSessionProps = {
  readonly locale: string;
  readonly onClick: (x: boolean) => void;
};

export const StrengthSession = (props: StrengthSessionProps) => {
  const {locale, onClick} = props;

  const handleClick = (event: any) => {
    event.preventDefault();
    onClick?.(true);
  };

  return (
    <div className="max-w-2xl">
      <a
        href="#"
        rel="noreferrer"
        target="_blank"
        className="relative flex flex-col items-stretch rounded-lg border border-gray-200 bg-gray-50 p-2 sm:flex-row"
        onClick={handleClick}
      >
        <div className="relative mb-2 flex shrink-0 justify-center sm:mb-0">
          <Image
            src={strengthSessionImage}
            alt=""
            className="h-36 w-36 rounded-lg object-cover pr-0 sm:pr-2"
          />
          <span className="absolute left-2 top-2 rounded-full bg-white p-2 py-1 text-xs text-gray-800 opacity-80 sm:bottom-2 sm:top-auto">
            {t('ages', locale)} 10 - 99
          </span>
        </div>
        <div className="flex flex-1 flex-col rounded-lg bg-white p-8">
          <div className="mb-2 text-lg font-bold">
            {t('strengthSessionCaption', locale)}
          </div>
          <div>{t('strengthSessionDescription', locale)}</div>
        </div>
      </a>
    </div>
  );
};

type Props = {
  readonly locale: LocaleCode;
};

export const ToolList = (props: Props) => {
  const {locale} = props;
  const [showStrengthSessionDialog, setShowStrengthSessionDialog] =
    useState(false);

  return (
    <>
      <div className="flex flex-col space-y-4">
        <StrengthSession
          locale={locale}
          onClick={setShowStrengthSessionDialog}
        />
        <V1LessonMaterial locale={locale} />
      </div>

      <StrengthSessionDialog
        locale={locale}
        isOpen={showStrengthSessionDialog}
        close={setShowStrengthSessionDialog}
      />
    </>
  );
};
