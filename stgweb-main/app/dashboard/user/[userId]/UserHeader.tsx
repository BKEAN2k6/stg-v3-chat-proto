'use client';

import Link from 'next/link';
import {type UserItem} from './_utils';
import {ArrowRightIcon} from '@/components/atomic/atoms/ArrowRightIcon';
import {PATHS} from '@/constants.mjs';
import Avatar from '@/components/atomic/organisms/Avatar';

type Props = {
  readonly user: UserItem;
};

export const UserHeader = (props: Props) => {
  const {user} = props;
  const name = user.name;
  const color = user.color;
  const avatar = user.avatar;
  const avatarSlug = user.avatarSlug;
  return (
    <>
      <div className="sticky top-0 z-10 w-full bg-white">
        <div className="h-[54px]">
          <div className="flex justify-between">
            <div className="ml-[20px] mt-[16px]">
              <Link href={PATHS.homeMoments}>
                <ArrowRightIcon />
              </Link>
            </div>
            <div className="mt-[16px] font-bold">{name}</div>
            <div className="mr-[20px] mt-[16px]">&nbsp;</div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="mb-4 flex w-full items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="min-w-[80px]">
              <Avatar
                size={80}
                avatarFileId={avatar}
                avatarSlug={avatarSlug}
                color={color}
                name={name}
                // strengths={topStrengthsArray}
              />
            </div>
            <div className="text-md font-bold">{name}</div>
          </div>
        </div>
      </div>
    </>
  );
};
