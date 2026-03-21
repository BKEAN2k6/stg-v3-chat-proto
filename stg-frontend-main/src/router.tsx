import {createBrowserRouter} from 'react-router-dom';
import {CurrentUserProvider} from './context/currentUserContext';
import DashboardPage from './pages';
import HomePage from './pages/home';
import StartPage from './pages/StartPage';
import EmailAuthPage from './pages/register/EmailAuthPage';
import RegisterCodePage from './pages/register/RegisterCodePage';
import RegisterUserPage from './pages/register/RegisterUserPage';
import RegisterMomentPage from './pages/register/RegisterMomentPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import EmailConfirmCallbackPage from './pages/EmailConfirmCallbackPage';
import CreateSprintPage from './pages/games/sprint/host/CreateSprintPage';
import JoinSprintPage from './pages/games/sprint/player/JoinSprintPage';
import HostSprintPage from './pages/games/sprint/host/HostSprintPage';
import PlayerSprintPage from './pages/games/sprint/player/PlayerSprintPage';
import RegisterPage from './pages/register';
import LogoutPage from './pages/LogoutPage';
import ArticleGategoryPage from './pages/materials/articles/ArticleCategoryPage';
import ArticlePage from './pages/materials/articles/ArticlePage';
import UnexpectedErrorPage from './pages/UnexpectedErrorPage';
import CreateMemoryGamePage from './pages/games/memory-game/host/CreateMemoryGamePage';
import HostMemoryGamePage from './pages/games/memory-game/host/HostMemoryGamePage';
import JoinMemoryGamePage from './pages/games/memory-game/player/JoinMemoryGamePage';
import PlayerMemoryGamePage from './pages/games/memory-game/player/PlayerMemoryGamePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
    errorElement: <UnexpectedErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/games/sprint',
        element: <CreateSprintPage />,
      },
      {
        path: '/games/memory-game',
        element: <CreateMemoryGamePage />,
      },
      {
        path: '/articles/:articleId',
        element: <ArticlePage />,
      },
      {
        path: '/article-categories/:rootCategoryId/article/:articleId',
        element: <ArticlePage />,
      },
      {
        path: '/article-categories/:categoryId',
        element: <ArticleGategoryPage />,
      },
      {
        path: '/article-categories/:rootCategoryId/category/:categoryId',
        element: <ArticleGategoryPage />,
      },
      {
        path: '/communities/:id/settings',
        async lazy() {
          const CommunitySettingsPage = await import(
            './pages/community-settings/CommunitySettingsPage'
          );
          return {Component: CommunitySettingsPage.default};
        },
      },
      {
        path: '/profile/',
        async lazy() {
          const EditProfilePage = await import(
            './pages/profile/EditProfilePage'
          );
          return {Component: EditProfilePage.default};
        },
      },
      {
        path: '/articles',
        async lazy() {
          const ArticleListPage = await import(
            './pages/materials/articles/ArticleListPage'
          );
          return {Component: ArticleListPage.default};
        },
      },
      {
        path: '/articles/new',
        async lazy() {
          const ArticleCreatePage = await import(
            './pages/materials/articles/ArticleCreatePage'
          );
          return {Component: ArticleCreatePage.default};
        },
      },

      {
        path: '/articles/:articleId/edit',
        async lazy() {
          const ArticleEditPage = await import(
            './pages/materials/articles/ArticleEditPage'
          );
          return {Component: ArticleEditPage.default};
        },
      },
      {
        path: '/article-categories/new',
        async lazy() {
          const ArticleCategoryCreatePage = await import(
            './pages/materials/articles/ArticleCategoryCreatePage'
          );
          return {Component: ArticleCategoryCreatePage.default};
        },
      },
      {
        path: '/article-categories/:categoryId/edit',
        async lazy() {
          const ArticleCategoryEditPage = await import(
            './pages/materials/articles/ArticleCategoryEditPage'
          );
          return {Component: ArticleCategoryEditPage.default};
        },
      },
      {
        path: '/communities/',
        async lazy() {
          const CommunityListPage = await import(
            './pages/communities/CommunityListPage'
          );
          return {Component: CommunityListPage.default};
        },
      },
      {
        path: '/users',
        async lazy() {
          const UsersPage = await import('./pages/users/UsersPage');
          return {Component: UsersPage.default};
        },
      },
      {
        path: '/scheduled-posts',
        async lazy() {
          const ScheduledPostsPage = await import(
            './pages/scheduled-posts/ScheduledPostsPage'
          );
          return {Component: ScheduledPostsPage.default};
        },
      },
      {
        path: '/scheduled-posts/challenge/create',
        async lazy() {
          const ChallengeCreatePage = await import(
            './pages/scheduled-posts/ChallengeCreatePage'
          );
          return {Component: ChallengeCreatePage.default};
        },
      },
      {
        path: '/scheduled-posts/challenge/:id',
        async lazy() {
          const ChallengeEditPage = await import(
            './pages/scheduled-posts/ChallengeEditPage'
          );
          return {Component: ChallengeEditPage.default};
        },
      },
      {
        path: '/scheduled-posts/coach-post/:id',
        async lazy() {
          const CoachPostEditPage = await import(
            './pages/scheduled-posts/CoachPostEditPage'
          );
          return {Component: CoachPostEditPage.default};
        },
      },
      {
        path: '/scheduled-posts/coach-post/create',
        async lazy() {
          const CoachPostCreatePage = await import(
            './pages/scheduled-posts/CoachPostCreatePage'
          );
          return {Component: CoachPostCreatePage.default};
        },
      },
      {
        path: '/strength-timeline',
        async lazy() {
          const StrengthTimelinePage = await import(
            './pages/strength-timeline/StrengthTimelinePage'
          );
          return {Component: StrengthTimelinePage.default};
        },
      },
      {
        path: '/emails',
        async lazy() {
          const EmailsPage = await import('./pages/emails/EmailsPage');
          return {Component: EmailsPage.default};
        },
      },
    ],
  },
  {
    path: '/start',
    element: (
      <CurrentUserProvider>
        <StartPage />
      </CurrentUserProvider>
    ),
  },
  {
    path: '/logout',
    element: (
      <CurrentUserProvider>
        <LogoutPage />
      </CurrentUserProvider>
    ),
  },
  {
    path: '/register',
    element: <RegisterPage />,
    children: [
      {
        path: '/register/emailauth',
        element: <EmailAuthPage />,
      },
      {
        path: '/register/code',
        element: <RegisterCodePage />,
      },
      {
        path: '/register/user',
        element: <RegisterUserPage />,
      },
      {
        path: '/register/moment',
        element: (
          <CurrentUserProvider>
            <RegisterMomentPage />
          </CurrentUserProvider>
        ),
      },
    ],
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/auth-callback',
    element: (
      <CurrentUserProvider>
        <AuthCallbackPage />
      </CurrentUserProvider>
    ),
  },
  {
    path: '/confirm-email',
    element: <EmailConfirmCallbackPage />,
  },
  {
    path: '/games/sprints/:sprintId/host',
    element: <HostSprintPage />,
  },
  {
    path: '/games/sprints/join',
    element: <JoinSprintPage />,
  },
  {
    path: '/games/sprints/:sprintId/player',
    element: <PlayerSprintPage />,
  },
  {
    path: '/games/memory-games/:gameId/host',
    element: <HostMemoryGamePage />,
  },
  {
    path: '/games/memory-game/join',
    element: <JoinMemoryGamePage />,
  },
  {
    path: '/games/memory-games/:gameId/player',
    element: <PlayerMemoryGamePage />,
  },
  {
    path: '/*',
    async lazy() {
      const NotFoundPage = await import('./pages/NotFoundPage');
      return {Component: NotFoundPage.default};
    },
  },
]);
