import {msg} from '@lingui/core/macro';
import {NavLink} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import {
  Trophy,
  TrophyFill,
  CameraReels,
  CameraReelsFill,
  House,
  Book,
  BarChart,
  BarChartFill,
  PersonGear,
  HouseFill,
  BookFill,
  Calendar,
  CalendarFill,
  PersonFillGear,
  Envelope,
  EnvelopeFill,
  Joystick,
  People,
  PeopleFill,
  CameraVideo,
  CameraVideoFill,
  CreditCard,
  CreditCardFill,
  ChatDots,
  ChatDotsFill,
  Mortarboard,
  MortarboardFill,
} from 'react-bootstrap-icons';
import clsx from 'clsx';
import {useLingui} from '@lingui/react';
import {useCurrentUser} from '@/context/currentUserContext.js';

type LinkItem = {
  readonly name: string;
  readonly icon: React.JSX.Element;
  readonly activeIcon: React.JSX.Element;
  readonly path: string;
};

type Properties = {
  readonly isCompact?: boolean;
  readonly onNavigate?: () => void;
};

export function SideMenuLinks(properties: Properties) {
  const {_} = useLingui();
  const {isCompact, onNavigate} = properties;
  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const regularLinks: LinkItem[] = [
    {name: _(msg`Home`), icon: <House />, activeIcon: <HouseFill />, path: '/'},
    {
      name: _(msg`Teach`),
      icon: <Book />,
      activeIcon: <BookFill />,
      path: '/article-categories/6673e91beb3b6fe4f7358876',
    },
    {
      name: _(msg`Pedagogy`),
      icon: <Mortarboard />,
      activeIcon: <MortarboardFill />,
      path: '/article-categories/69981962b89fddac2830d740',
    },
    {
      name: _(msg`Goals`),
      icon: <Trophy />,
      activeIcon: <TrophyFill />,
      path: '/strength-goals',
    },
    {
      name: _(msg`Games`),
      icon: <Joystick />,
      activeIcon: <Joystick />,
      path: '/games',
    },
  ];

  const groupsLink = {
    name: _(msg`Groups`),
    icon: <People />,
    activeIcon: <PeopleFill />,
    path: '/groups',
  };

  const adminLinks: LinkItem[] = currentUser.roles.includes('super-admin')
    ? [
        {
          name: _(msg`Retention`),
          icon: <BarChart />,
          activeIcon: <BarChartFill />,
          path: '/retention',
        },
        {
          name: _(msg`Animations`),
          icon: <CameraReels />,
          activeIcon: <CameraReelsFill />,
          path: '/animations',
        },
        {
          name: _(msg`Users`),
          icon: <PersonGear />,
          activeIcon: <PersonFillGear />,
          path: '/users',
        },
        {
          name: _(msg`Posts`),
          icon: <Calendar />,
          activeIcon: <CalendarFill />,
          path: '/scheduled-posts',
        },
        {
          name: _(msg`Materials`),
          icon: <Book />,
          activeIcon: <BookFill />,
          path: '/materials',
        },
        {
          name: _(msg`Emails`),
          icon: <Envelope />,
          activeIcon: <EnvelopeFill />,
          path: '/emails',
        },
        {
          name: _(msg`Quizzes`),
          icon: <Trophy />,
          activeIcon: <TrophyFill />,
          path: '/question-sets',
        },
        {
          name: _(msg`Video jobs`),
          icon: <CameraVideo />,
          activeIcon: <CameraVideoFill />,
          path: '/video-processing-jobs',
        },
        {
          name: _(msg`Billing`),
          icon: <CreditCard />,
          activeIcon: <CreditCardFill />,
          path: '/billing',
        },
        {
          name: _(msg`AI Logs`),
          icon: <ChatDots />,
          activeIcon: <ChatDotsFill />,
          path: '/ai-guidance-logs',
        },
      ]
    : [];

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
              <span className={clsx(isCompact && 'd-sm-none d-xxl-inline')}>
                {item.name}
              </span>
            )}
          </>
        )}
      </NavLink>
    </Nav.Item>
  );

  return (
    <Nav className="flex-column px-2 pt-2 pt-xxl-3 gap-2 overflow-hidden">
      {regularLinks.map((item) => renderLink(item))}
      <hr className="my-2" />
      {renderLink(groupsLink)}
      {adminLinks.length > 0 && <hr className="my-2" />}
      {adminLinks.map((item) => renderLink(item))}
    </Nav>
  );
}
