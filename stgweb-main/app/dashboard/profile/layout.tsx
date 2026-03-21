import {DashboardLayoutMain} from '../DashboardLayout';
import {ProfileHeader} from './ProfileHeader';

type Props = {
  children: React.ReactNode;
};

export default async function DashboardHomeLayout(props: Props) {
  const {children} = props;
  return (
    <DashboardLayoutMain hasSidebarsOnSide="both">
      <section className="flex justify-center">
        <div className="flex w-full flex-col items-start gap-2 sm:min-w-[520px] sm:max-w-[640px]">
          <ProfileHeader />
          <div className="w-full p-8">{children}</div>
        </div>
      </section>
    </DashboardLayoutMain>
  );
}
