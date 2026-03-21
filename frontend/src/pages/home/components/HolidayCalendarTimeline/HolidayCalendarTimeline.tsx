import React from 'react';
import HolidayCalendarTimelineButton from './HolidayCalendarTimelineButton.js';

export type TimelineItem = {
  postId: string;
  dayNumber: number;
  state: 'past' | 'current' | 'future';
};

type Properties = {
  readonly items: TimelineItem[];
  readonly buttonSize: number;
};

export default function HolidayCalendarTimeline(properties: Properties) {
  const {items, buttonSize} = properties;

  return (
    <div className="d-flex text-center" style={{gap: buttonSize / 10}}>
      {items.map((item, index) => {
        const {dayNumber, postId, state} = item;

        return (
          <React.Fragment key={dayNumber}>
            <HolidayCalendarTimelineButton
              state={state}
              postId={postId}
              dayNumber={dayNumber}
              buttonSize={buttonSize}
            />
            {index < items.length - 1 && <div className="flex-grow-1" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
