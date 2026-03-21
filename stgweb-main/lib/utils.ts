import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {SHARED_COOKIE_DOMAIN} from '@/constants.mjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function omitKeys<
  T extends Record<string, unknown>,
  K extends [...Array<keyof T>],
>(object: T, keys: K) {
  const returnValue = {} as {
    [K in keyof typeof object]: (typeof object)[K];
  };
  let key: keyof typeof object;
  for (key in object) {
    if (!keys.includes(key)) {
      returnValue[key] = object[key];
    }
  }

  return returnValue;
}

export async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function retry<T>(
  operation: () => Promise<T>,
  maxRetries: number,
): Promise<T> {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      // if (DEBUG) console.log("attempt #", maxRetries - retries + 1)
      // eslint-disable-next-line no-await-in-loop
      return await operation();
    } catch (error) {
      if (retries === 1) {
        throw new Error(
          `Operation failed after ${maxRetries} attempts: ${
            (error as Error).message
          }`,
        );
      }

      // eslint-disable-next-line no-await-in-loop
      await delay(1000);
      retries--;
    }
  }

  throw new Error('No retries left');
}

export function get<T = unknown, D = T>(
  object: Record<string, unknown>,
  path: string | string[],
  defaultValue?: D,
): T | D | undefined {
  // If path is a string, convert it to an array
  const pathArray = Array.isArray(path)
    ? path
    : path.replaceAll('[', '.').replaceAll(']', '').split('.');

  // Reduce the array of keys, traversing the object until the value is found or undefined
  let result: any = object;
  for (const key of pathArray) {
    if (result[key] === undefined) {
      return defaultValue;
    }

    result = result[key];
  }

  return result;
}

export function getHostname(url: string): string {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}

export function getUrlWithScheme(maybePartialUrl: string): string {
  if (
    maybePartialUrl.startsWith('http://') ||
    maybePartialUrl.startsWith('https://')
  ) {
    return maybePartialUrl;
  }

  const isLocal = process.env.NODE_ENV === 'development';
  return isLocal ? 'http://' + maybePartialUrl : 'https://' + maybePartialUrl;
}

export function groupArray(array: any[], groupSize: number) {
  const groupedArray: Array<{items: any[]}> = [];

  for (let i = 0; i < array.length; i += groupSize) {
    groupedArray.push({items: array.slice(i, i + groupSize)});
  }

  return groupedArray;
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function objectToUrlSafeBase64(inputObject: any): string {
  // Stringify the object
  const jsonString = JSON.stringify(inputObject);

  let base64 =
    typeof btoa === 'undefined'
      ? Buffer.from(jsonString).toString('base64')
      : btoa(unescape(encodeURIComponent(jsonString)));

  // Make it URL safe
  base64 = base64.replace('+', '-').replace('/', '_').replace(/=+$/, '');

  return base64;
}

export function urlSafeBase64ToObject(base64?: string): any {
  if (!base64) {
    return {};
  }

  // Make the base64 URL unsafe again
  base64 = base64.replace('-', '+').replace('_', '/');

  // Add the trailing '=' back if necessary
  while (base64.length % 4) {
    base64 += '=';
  }

  const jsonString =
    typeof atob === 'undefined'
      ? Buffer.from(base64, 'base64').toString()
      : decodeURIComponent(escape(atob(base64)));

  return JSON.parse(jsonString);
}

export function randomBetween(x: number, y: number): number {
  return Math.floor(Math.random() * (y - x)) + x;
}

// Calculates an equal division out of 100 for provided numbers

// Some examples:
// equalDivision([1]) => [100]
// equalDivision([1,1]) => [50, 50]
// equalDivision([1,2]) => [33, 67]
// equalDivision([10,10,10,10]) => [25, 25, 25, 25]
// equalDivision([10,10,10,10,10]) => [20, 20, 20, 20, 20]

export function equalDivision(numbers: number[]) {
  const total = numbers.reduce((a, b) => a + b, 0);
  const percentages = numbers.map((number) => {
    const number_ = (number / total) * 100;
    return Number.parseFloat(number_.toFixed(2));
  });
  return percentages;
}

export function getImageData(file: File) {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  return img;
}

export async function resizeImage(
  file: File,
  img: HTMLImageElement,
  maxWidth = 800,
) {
  return new Promise((resolve) => {
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      let scale = 1;

      // Only scale down images that are wider than the maximum width
      if (img.width > maxWidth) {
        scale = maxWidth / img.width;
      }

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, file.type);
      } else {
        resolve(file);
      }
    });
  });
}

export function dec2hex(dec: number) {
  return dec.toString(16).padStart(2, '0');
}

export function generateId(length: number) {
  const array = new Uint8Array((length || 40) / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join('');
}

export function getRandomItem(items: string[]): string {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export function cookieDomain() {
  return SHARED_COOKIE_DOMAIN;
}

// used for dynamic paths. Example:
// - path = /admin/organization/[slug]/users
// - replacePairs: { slug: "test-1 "}
// output: /admin/organization/test-1/users
export function sp(path: string, replacePairs: Record<string, string>) {
  let finalPath = path;
  for (const key of Object.keys(replacePairs)) {
    const value = replacePairs[key];
    finalPath = finalPath.replace(`[${key}]`, value);
  }

  return finalPath;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

// Random string generator that outputs a random string we can use for group
// slugs. Avoids strings that look like real words by alternating between
// letters and numbers (and skipping 1, 3, 5 and 0 that could be read as letters).
export function generateSafeRandomString(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbersAndSymbols = '246789_';
  let result = '';

  for (let i = 0; i < 5; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += numbersAndSymbols.charAt(
      Math.floor(Math.random() * numbersAndSymbols.length),
    );
  }

  // Ensure the first character is a letter or number
  if (!/[a-z\d]/i.test(result.charAt(0))) {
    result =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      result.slice(1);
  }

  // Ensure the last character is a letter or number
  if (!/[a-z\d]/i.test(result.at(-1) ?? '')) {
    result =
      result.slice(0, -1) +
      letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return result;
}

// @TODO: refactoring: this is probably too generic, move the whole thing it
// closer to see-the-good/customize, since that's the only place it can be used
// from.
export async function notify(data: any) {
  try {
    await fetch('/utils/notify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function recordEvent(data: {
  uid: string;
  event: string;
  metadata?: Record<string, any>;
  browser?: Record<string, string | number>;
}) {
  const eventCall = await fetch('/utils/event', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!eventCall.ok) {
    throw new Error('eventCall failed');
  }
}
