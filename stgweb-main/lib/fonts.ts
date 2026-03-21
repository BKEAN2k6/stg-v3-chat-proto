import {JetBrains_Mono as FontMono} from 'next/font/google';
import localFont from 'next/font/local';

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })
export const fontSans = localFont({
  display: 'swap',
  variable: '--font-sans',
  src: [
    {
      path: '../public/fonts/ageo/otf/Ageo.otf',
      weight: '400',
    },
    {
      path: '../public/fonts/ageo/otf/Ageo-SemiBold.otf',
      weight: '500',
    },
    {
      path: '../public/fonts/ageo/otf/Ageo-Bold.otf',
      weight: '700',
    },
    {
      path: '../public/fonts/ageo/otf/Ageo-Heavy.otf',
      weight: '800',
    },
  ],
});

// eslint-disable-next-line new-cap
export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});
