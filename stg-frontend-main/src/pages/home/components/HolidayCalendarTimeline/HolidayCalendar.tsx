import {useSearchParams} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import {Trans, msg} from '@lingui/macro';
import {differenceInCalendarDays} from 'date-fns';
import HolidayCalendarTimeline from './HolidayCalendarTimeline';

export default function HolidayCalendar() {
  const {_} = useLingui();

  const periods = [
    [
      {dayNumber: 2, postId: '6729e014dc400f79f06063bf', dayName: _(msg`Mon`)},
      {dayNumber: 3, postId: '6729e453dc400f79f06069a9', dayName: _(msg`Tue`)},
      {dayNumber: 4, postId: '6729e466dc400f79f0606abe', dayName: _(msg`Wed`)},
      {dayNumber: 5, postId: '6729e480dc400f79f0606bd3', dayName: _(msg`Thu`)},
      {dayNumber: 6, postId: '6729e49edc400f79f0606cf7', dayName: _(msg`Fri`)},
    ],
    [
      {dayNumber: 9, postId: '6729e4afdc400f79f0606e0c', dayName: _(msg`Mon`)},
      {dayNumber: 10, postId: '6729e4d0dc400f79f0607048', dayName: _(msg`Tue`)},
      {dayNumber: 11, postId: '6729e4eadc400f79f06071bb', dayName: _(msg`Wed`)},
      {dayNumber: 12, postId: '6729e4bcdc400f79f0606f24', dayName: _(msg`Thu`)},
      {dayNumber: 13, postId: '6729e522dc400f79f0607339', dayName: _(msg`Fri`)},
    ],
    [
      {dayNumber: 16, postId: '6729e536dc400f79f0607456', dayName: _(msg`Mon`)},
      {dayNumber: 17, postId: '6729e544dc400f79f060756b', dayName: _(msg`Tue`)},
      {dayNumber: 18, postId: '6729e551dc400f79f0607684', dayName: _(msg`Wed`)},
      {dayNumber: 19, postId: '6729e56adc400f79f06077b9', dayName: _(msg`Thu`)},
      {dayNumber: 20, postId: '6729e580dc400f79f06078ce', dayName: _(msg`Fri`)},
    ],
    [
      {dayNumber: 23, postId: '6729e592dc400f79f06079e3', dayName: _(msg`Mon`)},
      {dayNumber: 24, postId: '6729e5aedc400f79f0607b00', dayName: _(msg`Tue`)},
    ],
  ];
  const [searchParameters] = useSearchParams();
  const currentTime = new Date(
    searchParameters.get('currentTime') ?? Date.now(),
  );

  const periodsWithState = periods.map((period) =>
    period.map(({dayNumber, postId, dayName}) => {
      const state: 'past' | 'current' | 'future' =
        dayNumber < currentTime.getDate() || currentTime.getMonth() !== 11
          ? 'past'
          : dayNumber === currentTime.getDate()
            ? 'current'
            : 'future';

      return {
        dayNumber,
        dayName,
        postId,
        state,
      };
    }),
  );

  const daysLeft = differenceInCalendarDays(new Date('2024-12-2'), currentTime);

  return (
    <div
      style={{
        backgroundColor: '#027D5E',
      }}
      className="rounded border mb-4 transition-background"
    >
      <div className="d-flex justify-content-between m-2 py-2 fw-bold">
        <div className="d-flex justify-content-center align-items-center flex-grow-1 fs-5 text-light">
          {daysLeft > 0 ? (
            <Trans>Holiday calendar starts in...</Trans>
          ) : (
            <Trans>Holiday calendar</Trans>
          )}
        </div>
      </div>
      <div className="bg-white rounded m-2">
        {daysLeft > 0 ? (
          <div className="d-flex flex-column align-items-center text-center p-3">
            <span
              className="text-light text-3d"
              style={{
                fontSize: '50px',
                lineHeight: 1,
                fontWeight: 'bold',
                display: 'inline-block',
              }}
            >
              {daysLeft}
            </span>
            <Trans>Days</Trans>
          </div>
        ) : (
          <div className="overflow-hidden">
            <HolidayCalendarTimeline items={periodsWithState[0]} />
            <HolidayCalendarTimeline items={periodsWithState[1]} />
            <HolidayCalendarTimeline items={periodsWithState[2]} />
            <HolidayCalendarTimeline items={periodsWithState[3]} />
          </div>
        )}
      </div>
    </div>
  );
}
