import {NavLink} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import {
  /*   Archive,
  ArchiveFill, */
  CameraReels,
  CameraReelsFill,
  House,
  Book,
  Collection,
  PersonGear,
  HouseFill,
  Joystick,
  BookFill,
  Calendar,
  CalendarFill,
  CalendarRange,
  CalendarRangeFill,
  CollectionFill,
  PersonFillGear,
  Envelope,
  EnvelopeFill,
  Grid,
  GridFill,
} from 'react-bootstrap-icons';
import clsx from 'clsx';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useCurrentUser} from '@/context/currentUserContext';

type LinkItem = {
  readonly name: string;
  readonly icon: JSX.Element;
  readonly activeIcon: JSX.Element;
  readonly path: string;
};

type Props = {
  readonly isCompact?: boolean;
  readonly onNavigate?: () => void;
};

export function SideMenuLinks(props: Props) {
  const {_} = useLingui();
  const {isCompact, onNavigate} = props;
  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  // prettier-ignore
  const regularLinks: LinkItem[] = [
    { name: _(msg`Home`), icon: <House />, activeIcon: <HouseFill />, path: '/' },
    { name: _(msg`Teach`), icon: <Book />, activeIcon: <BookFill />, path: '/article-categories/6673e91beb3b6fe4f7358876' },
   /*  { name: _(msg`Pedagogy`), icon: <Archive />, activeIcon: <ArchiveFill />, path: '/article-categories/66ac78e02ed90a795b22240e' }, */
    {name: _(msg`Videos`), icon: <CameraReels />, activeIcon: <CameraReelsFill />, path: '/article-categories/66d014e06a2375334d8ceb8a' },
    {name: _(msg`Strenght sprint`), icon: <Joystick />, activeIcon: <Joystick />, path: '/games/sprint'},
    {name: _(msg`Memory game`), icon: <Grid />, activeIcon: <GridFill />, path: '/games/memory-game'},
  ];

  // prettier-ignore
  const adminLinks: LinkItem[] = currentUser.roles.includes('super-admin') ? [
    { name: _(msg`Communities`), icon: <Collection />, activeIcon: <CollectionFill />, path: '/communities' },
    { name: _(msg`Users`), icon: <PersonGear />, activeIcon: <PersonFillGear />, path: '/users' },
    { name: _(msg`Posts`), icon: <Calendar />, activeIcon: <CalendarFill />, path: '/scheduled-posts' },
    { name: _(msg`Articles`), icon: <Book />, activeIcon: <BookFill />, path: '/articles'},
    { name: _(msg`Timeline`), icon: <CalendarRange />, activeIcon: <CalendarRangeFill />, path: '/strength-timeline'},
    { name: _(msg`Emails`), icon: <Envelope />, activeIcon: <EnvelopeFill />, path: '/emails' },
  ] : [];

  const renderLink = (item: LinkItem) => (
    <Nav.Item key={item.name}>
      <NavLink
        to={item.path}
        className={({isActive}) =>
          clsx(
            'nav-link d-flex gap-2 align-items-center rounded',
            isActive && 'active',
          )
        }
        style={isCompact ? {maxWidth: 48} : undefined}
        onClick={onNavigate}
      >
        {({isActive}) => (
          <>
            <span>{isActive ? item.activeIcon : item.icon}</span>
            {!isCompact && (
              <span
                className={clsx(isCompact && 'd-sm-none d-xxl-inline')}
                style={{marginBottom: -3}}
              >
                {item.name}
              </span>
            )}
          </>
        )}
      </NavLink>
    </Nav.Item>
  );

  return (
    <Nav className="flex-column px-2 gap-2 overflow-hidden">
      {regularLinks.map((item) => renderLink(item))}
      {adminLinks.length > 0 && <hr className="my-2" />}
      {adminLinks.map((item) => renderLink(item))}
    </Nav>
  );
}
