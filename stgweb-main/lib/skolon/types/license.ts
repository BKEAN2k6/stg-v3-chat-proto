import {isData, isUuidRecord, type Data, type SkolonRecord} from './skolon';
import type {User} from './user';
import {getProperty, isObject} from '@/types/runtime';

export type LicenseResponse = {
  licenses: License[];
} & Data;

export type License = {
  id: string;
  expirationDate: string;
  ownerSchoolUuid: string;
  isDemo: boolean;
  users: Array<Pick<User, 'uuid'>>;
} & Pick<SkolonRecord, 'isDeleted'>;

export const isLicense = (license: unknown): license is License => {
  if (
    !isObject(license) ||
    typeof getProperty(license, 'id') !== 'string' ||
    typeof getProperty(license, 'expirationDate') !== 'string' ||
    typeof getProperty(license, 'isDemo') !== 'boolean' ||
    typeof getProperty(license, 'isDeleted') !== 'boolean' ||
    typeof getProperty(license, 'ownerSchoolUuid') !== 'string'
  ) {
    return false;
  }

  const users = getProperty(license, 'users');

  if (!users) {
    return true;
  }

  if (!Array.isArray(users)) {
    return false;
  }

  if (!users.every((user) => isUuidRecord(user))) {
    return false;
  }

  return true;
};

export const isLicenseResponse = (
  response: unknown,
): response is LicenseResponse => {
  if (!isObject(response)) {
    return false;
  }

  if (!isData(response)) {
    return false;
  }

  const licenses = getProperty(response, 'licenses');

  if (!Array.isArray(licenses)) {
    return false;
  }

  if (!licenses.every((license) => isLicense(license))) {
    return false;
  }

  return true;
};
