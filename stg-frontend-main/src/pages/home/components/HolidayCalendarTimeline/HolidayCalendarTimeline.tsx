import React from 'react';
import HolidayCalendarTimelineButton from './HolidayCalendarTimelineButton';

export type TimelineItem = {
  postId: string;
  dayNumber: number;
  state: 'past' | 'current' | 'future';
  dayName: string;
};
function HorisontalLine() {
  return (
    <div className="flex-grow-1 align-self-center">
      <hr className="d-none d-sm-block" />
    </div>
  );
}

type Props = {
  readonly items: TimelineItem[];
};

export default function HolidayCalendarTimeline(props: Props) {
  const {items} = props;

  return (
    <div className="d-flex text-center gap-0 gap-sm-2 gap-md-3 gap-lg-4 mx-1 mx-sm-3 mx-md-4 mx-lg-5 py-2 py-lg-3">
      {items.map((item, index) => {
        const {dayNumber, postId, state, dayName} = item;

        return (
          <React.Fragment key={dayNumber}>
            <HolidayCalendarTimelineButton
              state={state}
              postId={postId}
              dayNumber={dayNumber}
              dayName={dayName}
            />
            {index < items.length - 1 && <HorisontalLine />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
