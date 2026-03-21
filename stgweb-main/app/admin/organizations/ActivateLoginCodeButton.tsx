'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {type LocaleCode} from '@/lib/locale';
import {QRCodeImage} from '@/components/QRCodeImage';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atomic/atoms/Dialog';
import {SHORT_DOMAIN} from '@/constants.mjs';
import {getUrlWithScheme} from '@/lib/utils';

const ActivationStatus = ({
  isActive,
  secondsLeft,
}: {
  readonly isActive: boolean;
  readonly secondsLeft: number;
}) => (
  <div className="p-4 text-center">
    <p
      className={
        isActive
          ? 'mb-2 text-lg font-bold text-green-800'
          : 'mb-2 text-lg font-bold text-red-800'
      }
    >
      Code is currently {isActive ? 'active' : 'not active'}!
    </p>
    {!isActive && (
      <p className="text-sm font-bold text-red-800">
        Click on the button below to activate it
      </p>
    )}
    {isActive && (
      <p className="mt-4 text-xs text-green-800">
        Time remaining: {Math.floor(secondsLeft / 60)} minutes,{' '}
        {secondsLeft % 60} seconds
      </p>
    )}
  </div>
);

type Props = {
  readonly secondsStillActive: number;
  readonly organizationId: string;
  readonly organizationName: string;
  readonly organizationLanguage: LocaleCode;
  readonly joinShortCode: string;
};

export const ActivateLoginCodeButton = (props: Props) => {
  const {
    secondsStillActive,
    organizationId,
    organizationName,
    organizationLanguage,
    joinShortCode,
  } = props;
  const [qrCodeImage, setQRCodeImage] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean>(secondsStillActive > 0);
  const [secondsLeft, setSecondsLeft] = useState<number>(secondsStillActive);
  const [isLoading, setIsLoading] = useState(false);
  const qrDisplayDomain = SHORT_DOMAIN;
  const qrCodeDomain = getUrlWithScheme(SHORT_DOMAIN);

  const doActivateLoginCode = async () => {
    setIsLoading(true);
    const directus = createClientSideDirectusClient();
    const timeInOneHour = new Date();
    timeInOneHour.setHours(timeInOneHour.getHours() + 1);
    try {
      await refreshAuthIfExpired();
      await directus.items('organization').updateOne(organizationId, {
        join_short_code_expires_at: timeInOneHour.toISOString(),
      });
      setIsActive(true);
      setSecondsLeft(60 * 60); // reset the countdown
    } catch {
      toast.error('Failed to activate code');
    }

    setIsLoading(false);
  };

  const handleImageGenerated = (dataUrl: string) => {
    setQRCodeImage(dataUrl);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else {
      setIsActive(false);
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, secondsLeft]);

  return (
    <Dialog>
      <DialogTrigger className="rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
        <>
          Login Code (
          {isActive ? (
            <span className="text-green-200">active</span>
          ) : (
            <span className="text-red-200">not active</span>
          )}
          )
        </>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{organizationName}</DialogTitle>
          <DialogDescription>
            Users can login by going to <strong>{qrDisplayDomain}</strong> and
            typing in the code, or by directly scanning the code. Right click
            and &quot;Save Image As&quot; or &quot;Copy&quot; to copy to
            training materials.
          </DialogDescription>
        </DialogHeader>
        <ActivationStatus isActive={isActive} secondsLeft={secondsLeft} />
        <div>
          <hr />
          <div className="py-4">
            {qrCodeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrCodeImage} alt="QR code" />
            ) : (
              <QRCodeImage
                qrDisplayDomain={qrDisplayDomain}
                qrCodeDomain={qrCodeDomain}
                joinShortCode={joinShortCode}
                locale={organizationLanguage}
                onImageGenerated={handleImageGenerated}
              />
            )}
          </div>
          <hr />
        </div>
        <ActivationStatus isActive={isActive} secondsLeft={secondsLeft} />
        <ButtonWithLoader
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          isLoading={isLoading}
          onClick={doActivateLoginCode}
        >
          {isActive ? 'Reactivate login code' : 'Activate login code'}
        </ButtonWithLoader>
      </DialogContent>
    </Dialog>
  );
};
