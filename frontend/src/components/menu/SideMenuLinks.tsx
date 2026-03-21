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
  ChatHeart,
  ChatHeartFill,
  BookFill,
  Calendar,
  CalendarFill,
  PersonFillGear,
  Envelope,
  EnvelopeFill,
  Grid,
  GridFill,
  People,
  PeopleFill,
  CameraVideo,
  CameraVideoFill,
  CreditCard,
  CreditCardFill,
  ChatDots,
  ChatDotsFill,
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
      name: _(msg`Videos`),
      icon: <CameraReels />,
      activeIcon: <CameraReelsFill />,
      path: '/article-categories/66d014e06a2375334d8ceb8a',
    },
    {
      name: _(msg`Strength sprint`),
      icon: <ChatHeart />,
      activeIcon: <ChatHeartFill />,
      path: '/games/sprint',
    },
    {
      name: _(msg`Memory game`),
      icon: <Grid />,
      activeIcon: <GridFill />,
      path: '/games/memory-game',
    },
    {
      name: _(msg`Groups`),
      icon: <People />,
      activeIcon: <PeopleFill />,
      path: '/groups',
    },
    {
      name: _(msg`Goals`),
      icon: <Trophy />,
      activeIcon: <TrophyFill />,
      path: '/strength-goals',
    },
    {
      name: _(msg`Coach Kaisa`),
      icon: <ChatDots />,
      activeIcon: <ChatDotsFill />,
      path: '/coaching',
    },
  ];

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
        {
          name: _(msg`Coaching Plans`),
          icon: <Book />,
          activeIcon: <BookFill />,
          path: '/coaching-plans',
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
      {adminLinks.length > 0 && <hr className="my-2" />}
      {adminLinks.map((item) => renderLink(item))}
    </Nav>
  );
}
