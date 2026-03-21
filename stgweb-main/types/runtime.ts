export const isObject = (data?: unknown): data is Record<string, unknown> =>
  Boolean(data) && typeof data === 'object';
export const getProperty = <T extends Record<string, unknown>>(
  object: T,
  key: string,
) => Object.hasOwn(object, key) && object[key];
