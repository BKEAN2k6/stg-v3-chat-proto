import React from 'react';
import {useLingui} from '@lingui/react';
import StrengthTimelineButton from './StrengthTimelineButton';
import {type StrengthSlug} from '@/api/ApiTypes';
import {strengthTranslationMap, strengthColorMap} from '@/helpers/strengths';
import {type LanguageCode} from '@/i18n';

export type TimelineItem = {
  start: Date;
  end: Date;
  articleId: string;
  rootCategoryId: string;
};

export type StrengthPeriodWithEnd = {
  _id: string;
  strength: StrengthSlug;
  timeline: TimelineItem[];
};

function HorisontalLine() {
  return (
    <div className="flex-grow-1 align-self-center">
      <hr className="d-none d-sm-block" />
    </div>
  );
}

type Props = {
  readonly period: StrengthPeriodWithEnd;
};

export default function StrengthTimeline(props: Props) {
  const {period} = props;
  const {i18n} = useLingui();
  const {strength, timeline} = period;
  const {locale} = i18n;
  const types: Array<'start' | 'speak' | 'act' | 'assess'> = [
    'start',
    'speak',
    'act',
    'assess',
  ];

  const color = strengthColorMap[strength][300];

  return (
    <>
      <h5 className="text-center pt-3 pb-2">
        {strengthTranslationMap[strength][locale as LanguageCode]}
      </h5>
      <div className="d-flex text-center gap-1 gap-sm-3 gap-md-4 gap-lg-5 mx-2 mx-sm-3 mx-md-4 mx-lg-5 pb-2 pb-lg-3">
        {timeline.map((item, index) => {
          const {start, end, articleId} = item;
          const currentTime = new Date();

          let state: 'current' | 'future' | 'past';
          if (currentTime < start) {
            state = 'future';
          } else if (currentTime < end) {
            state = 'current';
          } else {
            state = 'past';
          }

          return (
            <React.Fragment key={start.toDateString()}>
              <StrengthTimelineButton
                color={color}
                type={types[index]}
                strength={strength}
                state={state}
                articleId={articleId}
                rootCategoryId={item.rootCategoryId}
              />
              {index < timeline.length - 1 && <HorisontalLine />}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}
