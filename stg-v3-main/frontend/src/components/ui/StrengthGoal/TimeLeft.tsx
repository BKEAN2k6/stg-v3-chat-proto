import {useEffect, useState} from 'react';

type Properties = {
  readonly targetDate: string;
};

export default function TimeLeft({targetDate}: Properties) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => {
      clearInterval(interval);
    }; // cleanup on unmount
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return null;
  }

  return (
    <>
      {timeLeft.days > 0 && `${timeLeft.days}D `}
      {timeLeft.hours > 0 && `${timeLeft.hours}H `}
      {timeLeft.minutes > 0 && `${timeLeft.minutes}MIN `}
      {timeLeft.lessThanHour ? `${timeLeft.seconds}S` : null}
    </>
  );
}

function calculateTimeLeft(targetDate: string) {
  const currentDate = new Date();
  const targetDateObject = new Date(targetDate);
  const timeDifference = targetDateObject.getTime() - currentDate.getTime();

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return {
    total: timeDifference,
    days,
    hours,
    minutes,
    seconds,
    lessThanHour: days === 0 && hours === 0,
  };
}
