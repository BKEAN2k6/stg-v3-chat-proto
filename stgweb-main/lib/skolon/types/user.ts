import type {School} from './school';
import {
  isData,
  isSkolonRecord,
  isUuidRecord,
  type Data,
  type SkolonRecord,
} from './skolon';
import {getProperty, isObject} from '@/types/runtime';

export type UserResponse = {
  users: User[];
} & Data;

export type User = {
  userType: 'STUDENT' | 'TEACHER';
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  schools?: Array<Pick<School, 'uuid'>>;
} & SkolonRecord;

export const isUserResponse = (response: unknown): response is UserResponse => {
  if (!isObject(response)) {
    return false;
  }

  if (!isData(response)) {
    return false;
  }

  const users = getProperty(response, 'users');

  if (!Array.isArray(users)) {
    return false;
  }

  if (!users.every((user) => isUser(user))) {
    return false;
  }

  return true;
};

export const isUser = (user: unknown): user is User => {
  if (
    !isObject(user) ||
    !isSkolonRecord(user) ||
    typeof getProperty(user, 'userType') !== 'string' ||
    typeof getProperty(user, 'email') !== 'string' ||
    typeof getProperty(user, 'firstName') !== 'string' ||
    typeof getProperty(user, 'lastName') !== 'string' ||
    typeof getProperty(user, 'language') !== 'string'
  ) {
    return false;
  }

  const schools = getProperty(user, 'schools');

  if (!schools) {
    return true;
  }

  if (!Array.isArray(schools)) {
    return false;
  }

  if (!schools.every((shchool) => isUuidRecord(shchool))) {
    return false;
  }

  return true;
};
