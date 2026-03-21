'use client';

import {type UserItem} from './_utils';
import {MomentInput} from '@/components/MomentInput/MomentInput';

type Props = {
  readonly user: UserItem;
};

export const UserProfilePage = (props: Props) => {
  const {user} = props;

  return (
    <section>
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <MomentInput
          target="other"
          swlWallId={user.strengthWallId}
          targetName={user.name}
          targetUserId={user.id}
        />
      </div>
    </section>
  );
};
