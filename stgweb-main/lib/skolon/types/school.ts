import {isData, isSkolonRecord, type Data, type SkolonRecord} from './skolon';
import {getProperty, isObject} from '@/types/runtime';

export type SchoolResponse = {
  schools: School[];
} & Data;

export type School = {
  name: string;
} & SkolonRecord;

export const isSchool = (school: unknown): school is School =>
  isObject(school) &&
  isSkolonRecord(school) &&
  typeof getProperty(school, 'name') === 'string';

export const isSchoolResponse = (
  response: unknown,
): response is SchoolResponse => {
  if (!isObject(response)) {
    return false;
  }

  if (!isData(response)) {
    return false;
  }

  const schools = getProperty(response, 'schools');

  if (!Array.isArray(schools)) {
    return false;
  }

  if (!schools.every((school) => isSchool(school))) {
    return false;
  }

  return true;
};
