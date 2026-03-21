import type {LicenseResponse} from './license';
import type {SchoolResponse} from './school';
import type {UserResponse} from './user';
import {getProperty, isObject} from '@/types/runtime';

export type ISkolonService = {
  checkUserHasValidLicense: (
    userUuid?: string,
    accessToken?: string,
  ) => Promise<boolean>;
  syncSchoolsForUser: (userUuid: string) => Promise<void>;
  syncBasicUserData: (userUuid: string, accessToken: string) => Promise<void>;
};

export type ISkolonConnection = {
  getUsers: (
    options?: GetUsersOptions,
    accessToken?: string,
  ) => Promise<UserResponse>;
  getSchools: (
    options?: GetSchoolsOptions,
    accessToken?: string,
  ) => Promise<SchoolResponse>;
  getLicenses: (
    options?: GetLicensesOptions,
    accessToken?: string,
  ) => Promise<LicenseResponse>;
};

export type SkolonSDK = {
  auth: (token: string) => void;
  partner_API_v2GetUsers: (options?: GetUsersOptions) => Promise<unknown>;
  partner_API_v2GetSchools: (options?: GetSchoolsOptions) => Promise<unknown>;
  partner_API_v2GetLicenses: (options?: GetLicensesOptions) => Promise<unknown>;
};

export type GetSkolonRecordsOptions = {
  uuid?: string;
  versionTag?: string;
  limit?: number;
  cursor?: string;
};

export type GetUsersOptions = {
  schoolUuid?: string;
} & GetSkolonRecordsOptions;

export type GetSchoolsOptions = {
  userUuid?: string;
} & GetSkolonRecordsOptions;

export type GetLicensesOptions = {
  userUuid?: string;
  ownerSchoolUuid?: string;
} & GetSkolonRecordsOptions;

export type SkolonResponse = {
  data?: Data;
  status: number;
};

export type Data = {
  versionTag: number | string;
  hasMore: boolean;
  cursor?: string;
};

export type SkolonRecord = {
  uuid: string;
  isDeleted: boolean;
};

export const isSkolonResponse = (
  response: unknown,
): response is SkolonResponse =>
  isObject(response) &&
  typeof getProperty(response, 'status') === 'number' &&
  isData(response.data);

export const isData = (response: unknown): response is Data => {
  if (!isObject(response)) {
    return false;
  }

  return (
    isObject(response) &&
    ['number', 'string'].includes(typeof getProperty(response, 'versionTag')) &&
    typeof getProperty(response, 'hasMore') === 'boolean' &&
    (!getProperty(response, 'cursor') ||
      typeof getProperty(response, 'cursor') === 'string')
  );
};

export const isSkolonRecord = (record: unknown): record is SkolonRecord =>
  isObject(record) &&
  typeof getProperty(record, 'uuid') === 'string' &&
  typeof getProperty(record, 'isDeleted') === 'boolean';

export const isUuidRecord = (
  school: unknown,
): school is Pick<SkolonRecord, 'uuid'> =>
  isObject(school) && typeof getProperty(school, 'uuid') === 'string';
