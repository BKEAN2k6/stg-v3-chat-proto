import {DashboardLayoutMain} from '../DashboardLayout';
import {HomeHeader} from './HomeHeader';

type Props = {
  children: React.ReactNode;
};

export default async function DashboardHomeLayout(props: Props) {
  const {children} = props;
  return (
    <DashboardLayoutMain hasSidebarsOnSide="both">
      <section className="flex justify-center">
        <div className="flex w-full flex-col items-start gap-2 sm:min-w-[520px] sm:max-w-[640px]">
          <HomeHeader />
          <div className="w-full">{children}</div>
        </div>
      </section>
    </DashboardLayoutMain>
  );
}
