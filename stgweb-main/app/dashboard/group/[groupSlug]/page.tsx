import {redirect} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {sp} from '@/lib/utils';

type Props = {
  params: {
    groupSlug: string;
  };
};

export default async function DashboardGroupPage(props: Props) {
  const {groupSlug} = props.params;
  redirect(sp(PATHS.groupStrengths, {groupSlug}));
}
