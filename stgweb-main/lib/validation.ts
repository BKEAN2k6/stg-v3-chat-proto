export const latinAlphabet = 'A-Za-z';
export const latinAlphabetWithSpecials = 'A-Za-zÀ-ÿ';
export const lowerCaseLatinAlphabet = 'a-z';
export const numbers = '0-9';
export const spaceAndDash = ' -';
export const atSignDotDashAndPlus = '@.+-';
export const linebreak = '\n';
export const commonSpecialCharacters = '.,!()?"\'@#$%&*+=/\\\\[\\]{}<>:;|~^';

export function validateAndNormalizeInput(
  input: string,
  validCharacters: string,
  trim?: boolean,
  allowLines?: boolean,
): string {
  // Construct a regular expression that matches any character not in the set of valid characters.
  const invalidCharacterRegex = new RegExp(`[^${validCharacters}]`, 'g');

  // Remove any invalid characters from the input.
  let sanitizedInput = input.replace(invalidCharacterRegex, '');

  // Replace all contiguous spans of whitespace characters with a single space.
  if (!allowLines) sanitizedInput = sanitizedInput.replaceAll(/\s+/g, ' ');

  // Trim any leading or trailing whitespace.
  if (trim) {
    sanitizedInput = sanitizedInput.trim();
  }

  return sanitizedInput;
}

export function validateEmail(input: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(input);
}

export function validatePassword(password: string, returnReasons?: boolean) {
  // const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,}$/
  const breakReasons = [];

  // NOTE: this is inverse, so checking if the length is less than or equal 11!
  // (to break if it is)
  if (password.length <= 11) {
    breakReasons.push('12-characters');
  }

  if (!/[a-z]/.test(password)) {
    breakReasons.push('at-least-1-lowercase');
  }

  if (!/[A-Z]/.test(password)) {
    breakReasons.push('at-least-1-uppercase');
  }

  if (!/\d/.test(password)) {
    breakReasons.push('at-least-1-number');
  }

  if (returnReasons) {
    return breakReasons;
  }

  return breakReasons.length === 0;
}
