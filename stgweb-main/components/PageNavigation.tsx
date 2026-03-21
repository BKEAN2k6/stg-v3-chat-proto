import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Fragment} from 'react';
import {cn} from '@/lib/utils';

type NavItemProps = {
  readonly title: string;
  readonly path: string;
  readonly itemCount: number;
};

const NavItem = (props: NavItemProps) => {
  const {title, path, itemCount} = props;
  const pathname = usePathname();
  const isActive = pathname.startsWith(path);
  return (
    <Link
      href={path}
      className={cn(
        'mb-[-1px] py-4',
        itemCount === 2 && 'px-14 xs:px-20 sm:px-28',
        itemCount === 3 && 'px-4 xs:px-10 md:px-16',
        isActive && 'border-b-2 border-primary font-bold text-primary',
      )}
    >
      {title}
    </Link>
  );
};

type Props = {
  readonly items: Array<{
    slug: string;
    text: string;
    path: string;
  }>;
};

export const PageNavigation = (props: Props) => {
  const {items} = props;
  return (
    <div className="flex w-full justify-between border-b border-[#e5e7eb] px-4">
      {items.map((item) => (
        <Fragment key={`page-nav-link-${item.slug}`}>
          <NavItem
            title={item.text}
            path={item.path}
            itemCount={items.length}
          />
        </Fragment>
      ))}
    </div>
  );
};
