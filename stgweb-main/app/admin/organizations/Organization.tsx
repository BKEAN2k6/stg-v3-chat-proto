import React from 'react';
import Link from 'next/link';
import {ADMIN_PATHS} from '../admin-paths';
import {ActivateLoginCodeButton} from './ActivateLoginCodeButton';
import {AddUserButton} from './AddUserButton';
import {type LocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';

type GridRowProps = {
  readonly caption: string;
  readonly value: string | number;
};
const GridRow = (props: GridRowProps) => (
  <div className="px-2 pb-2 pt-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900">
      {props.caption}
    </dt>
    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
      {props.value}
    </dd>
  </div>
);

type Props = {
  readonly className?: string;
  readonly index: number;
  readonly org: {
    id: string;
    slug: string;
    name: string;
    defaultLanguage: LocaleCode;
    created: string;
    numUsers: number;
    lastAccess: string;
    adminFirstName: string;
    adminLastName: string;
    adminEmail: string;
    secondsStillActive: number;
    joinShortCode: string;
  };
};

export const Organization = (props: Props) => {
  const {className, index, org} = props;

  return (
    // <div className={cn("border-b border-gray-200 mt-8", className)}>
    <div className={cn('my-8 rounded-md border border-gray-200', className)}>
      <div className="flex flex-col justify-between p-4 lg:flex-row lg:items-center">
        <div className="grow">
          <h2 className="mb-2 text-lg font-bold">{org.name}</h2>
          <div className="mt-6 max-w-md">
            <dl
              className={cn(
                'divide-y',
                index % 2 === 0 ? 'divide-gray-100' : 'divide-gray-200',
              )}
            >
              <GridRow
                caption="Created"
                value={new Date(org.created).toLocaleDateString()}
              />
              <GridRow caption="Language" value={org.defaultLanguage} />
              <GridRow caption="User count" value={org.numUsers} />
              <GridRow
                caption="Last Access"
                value={
                  org.lastAccess
                    ? new Date(org.lastAccess).toLocaleDateString()
                    : 'Not accessed yet'
                }
              />
              <GridRow
                caption="Admin"
                value={
                  org.adminEmail
                    ? `${org.adminFirstName} ${org.adminLastName} (${org.adminEmail})`
                    : 'Unknown'
                }
              />
            </dl>
          </div>
        </div>
        <div className="ml-2 mt-4 flex flex-row space-x-2 space-y-2 self-start sm:flex-col lg:mt-0">
          <ActivateLoginCodeButton
            organizationId={org.id}
            organizationName={org.name}
            organizationLanguage={org.defaultLanguage}
            joinShortCode={org.joinShortCode}
            secondsStillActive={org.secondsStillActive}
          />
          <AddUserButton
            organizationId={org.id}
            organizationName={org.name}
            organizationLanguage={org.defaultLanguage}
          />
          <Link
            href={ADMIN_PATHS.organizationUsers.replace('[slug]', org.slug)}
            className="flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-center text-xs font-bold text-white hover:bg-blue-700"
          >
            Details
          </Link>
          {/* <button className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
            Post
          </button>
          <button className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700">
            Update
          </button> */}
        </div>
      </div>
    </div>
  );
};
