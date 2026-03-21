import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useSearchParams} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import {differenceInCalendarDays} from 'date-fns';
import React from 'react';
import HolidayCalendarTimeline from './HolidayCalendarTimeline.js';
import useBreakpoint from '@/hooks/useBreakpoint.js';

export default function HolidayCalendar() {
  const {_} = useLingui();
  const breakpoint = useBreakpoint();

  const buttonSize = breakpoint === 'xl' ? 28 : 30;
  const weekdays = [
    _(msg`Mon`),
    _(msg`Tue`),
    _(msg`Wed`),
    _(msg`Thu`),
    _(msg`Fri`),
  ];

  const periods = [
    [
      {dayNumber: 1, postId: '690c5106292c89df8cc2aafe'},
      {dayNumber: 2, postId: '690c511d292c89df8cc30b9b'},
      {dayNumber: 3, postId: '690c513d292c89df8cc36c78'},
      {dayNumber: 4, postId: '690c5167292c89df8cc3cf91'},
      {dayNumber: 5, postId: '690c517e292c89df8cc4307f'},
    ],
    [
      {dayNumber: 8, postId: '690c5196292c89df8cc4915c'},
      {dayNumber: 9, postId: '690c51a9292c89df8cc4f1dc'},
      {dayNumber: 10, postId: '690c51b9292c89df8cc5525c'},
      {dayNumber: 11, postId: '690c51dd292c89df8cc5b396'},
      {dayNumber: 12, postId: '690c5207292c89df8cc61423'},
    ],
    [
      {dayNumber: 15, postId: '690c521b292c89df8cc674b1'},
      {dayNumber: 16, postId: '690c5230292c89df8cc6d5b9'},
      {dayNumber: 17, postId: '690c5245292c89df8cc736ad'},
      {dayNumber: 18, postId: '690c5269292c89df8cc79768'},
      {dayNumber: 19, postId: '690c5285292c89df8cc7f87b'},
    ],
  ];
  const [searchParameters] = useSearchParams();
  const currentTime = new Date(
    searchParameters.get('currentTime') ?? Date.now(),
  );

  const periodsWithState = periods.map((period) =>
    period.map(({dayNumber, postId}) => {
      const state: 'past' | 'current' | 'future' =
        dayNumber < currentTime.getDate() || currentTime.getMonth() !== 11
          ? 'past'
          : dayNumber === currentTime.getDate()
            ? 'current'
            : 'future';

      return {
        dayNumber,
        postId,
        state,
      };
    }),
  );

  const daysLeft = differenceInCalendarDays(new Date(2025, 11, 1), currentTime);
  return (
    <div
      style={{
        backgroundColor: '#027D5E',
      }}
      className="rounded border transition-background"
    >
      <div className="d-flex justify-content-between m-2 py-2 fw-bold">
        <div className="d-flex justify-content-center align-items-center flex-grow-1 fs-5 text-light text-center">
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
          <div>
            <div
              className="d-flex flex-row text-center p-2 pb-0"
              style={{gap: buttonSize / 20}}
            >
              {weekdays.map((day, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={day + index}>
                  <div
                    style={{
                      width: buttonSize,
                      fontSize: buttonSize / 2.2,
                      fontWeight: '800',
                    }}
                    className="fw-bold text-uppercase"
                  >
                    {day.charAt(0)}
                  </div>
                  {index < weekdays.length - 1 && (
                    <div className="flex-grow-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="d-flex flex-column gap-2 overflow-hidden p-2">
              <HolidayCalendarTimeline
                items={periodsWithState[0]}
                buttonSize={buttonSize}
              />
              <HolidayCalendarTimeline
                items={periodsWithState[1]}
                buttonSize={buttonSize}
              />
              <HolidayCalendarTimeline
                items={periodsWithState[2]}
                buttonSize={buttonSize}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
