import React, {useRef} from 'react';
import {toPng} from 'html-to-image';
import {QRCodeCanvas} from 'qrcode.react';
import reactStringReplace from 'react-string-replace';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {type LocaleCode} from '@/lib/locale';

type QRCodeImageProps = {
  readonly qrDisplayDomain: string;
  readonly qrCodeDomain: string;
  readonly joinShortCode: string;
  readonly onImageGenerated?: (dataUrl: string) => void;
  readonly locale: LocaleCode;
};

const texts = {
  scanQr: {
    'en-US': 'Scan QR',
    'fi-FI': 'Skannaa QR',
    'sv-SE': 'Skanna QR',
  },
  or: {
    'en-US': 'Or',
    'fi-FI': 'Tai',
    'sv-SE': 'Eller',
  },
  enterCodeAt: {
    'en-US': 'Enter code at [url]',
    'fi-FI': 'Anna koodi osoitteessa [url]',
    'sv-SE': 'Ange koden på [url]',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const QRCodeImage = (props: QRCodeImageProps) => {
  const {
    onImageGenerated,
    joinShortCode,
    qrDisplayDomain,
    qrCodeDomain,
    locale,
  } = props;
  const divRef = useRef(null);

  const joinPath = `start/join/${joinShortCode}`;

  useLegacyEffect(() => {
    if (onImageGenerated && divRef.current) {
      toPng(divRef.current)
        .then((dataUrl) => {
          onImageGenerated(dataUrl);
        })
        .catch((error) => {
          // Handle any errors generating the image.
          console.error('Oops, something went wrong!', error);
        });
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="flex flex-col items-center justify-center bg-white"
    >
      <div className="my-4 text-xl font-bold">{t('scanQr', locale)}</div>
      <QRCodeCanvas
        size={256}
        value={`${qrCodeDomain}/?target=${encodeURIComponent(joinPath)}`}
      />
      <div className="mt-4 text-md">{t('or', locale).toLowerCase()}</div>
      <div className="mt-2 px-4 text-lg font-bold">
        {reactStringReplace(t('enterCodeAt', locale), '[url]', () => (
          <span key="domain" className="text-primary">
            {qrDisplayDomain}
          </span>
        ))}
      </div>
      <div className="mt-2 text-3xl font-bold">{joinShortCode}</div>
    </div>
  );
};
