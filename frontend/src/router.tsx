import {createBrowserRouter} from 'react-router-dom';
import RootLayout from './layouts/RootLayout.js';
import GroupsPage from './pages/groups/GroupsPage.js';
import GoalsPage from './pages/strength-goals/GoalsPage.js';
import HostQuizPage from './pages/games/quiz/host/HostQuizPage.js';
import JoinQuizPage from './pages/games/quiz/player/JoinQuizPage.js';
import PlayerQuizPage from './pages/games/quiz/player/PlayerQuizPage.js';
import {ActiveGroupProvider} from './context/activeGroupContext.js';
import GroupGameJoinPage from './pages/games/GroupGameJoinPage.js';
import GroupGamesLobbyPage from './pages/games/GroupGameLobbyPage.js';
import DashboardPage from '@/pages/DashboardPage.js';
import HomePage from '@/pages/home/HomePage.js';
import StartPage from '@/pages/StartPage.js';
import RegisterCodePage from '@/pages/register/RegisterCodePage.js';
import RegisterUserPage from '@/pages/register/RegisterUserPage.js';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.js';
import AuthCallbackPage from '@/pages/AuthCallbackPage.js';
import EmailConfirmCallbackPage from '@/pages/EmailConfirmCallbackPage.js';
import CreateSprintPage from '@/pages/games/sprint/host/CreateSprintPage.js';
import HostSprintPage from '@/pages/games/sprint/host/HostSprintPage.js';
import PlayerSprintPage from '@/pages/games/sprint/player/PlayerSprintPage.js';
import RegisterPage from '@/pages/register/RegisterPage.js';
import LogoutPage from '@/pages/LogoutPage.js';
import ArticleGategoryPage from '@/pages/materials/article-gategory/ArticleCategoryPage.js';
import ArticlePage from '@/pages/materials/article/ArticlePage.js';
import UnexpectedErrorPage from '@/pages/UnexpectedErrorPage.js';
import CreateMemoryGamePage from '@/pages/games/memory-game/host/CreateMemoryGamePage.js';
import HostMemoryGamePage from '@/pages/games/memory-game/host/HostMemoryGamePage.js';
import PlayerMemoryGamePage from '@/pages/games/memory-game/player/PlayerMemoryGamePage.js';
import CommunityInvitationsPage from '@/pages/community-invitations/CommunityInvitationsPage.js';
import {CurrentUserProvider} from '@/context/currentUserContext.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <UnexpectedErrorPage />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
        children: [
          {path: '/', element: <HomePage />},
          {path: '/games/sprint', element: <CreateSprintPage />},
          {path: '/games/memory-game', element: <CreateMemoryGamePage />},
          {path: '/groups/', element: <GroupsPage />},
          {
            path: '/strength-goals/',
            element: <GoalsPage />,
          },
          {
            path: '/coaching',
            async lazy() {
              const CoachingPage =
                await import('./pages/coaching/CoachingPage.js');
              return {Component: CoachingPage.default};
            },
          },
          {
            path: '/coaching/:id',
            async lazy() {
              const CoachingSessionPage =
                await import('./pages/coaching/CoachingSessionPage.js');
              return {Component: CoachingSessionPage.default};
            },
          },
          {path: '/articles/:articleId', element: <ArticlePage />},
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
            path: '/community-invitations',
            element: <CommunityInvitationsPage />,
          },
        ],
      },
      {
        path: '/',
        element: <DashboardPage />,
        errorElement: <UnexpectedErrorPage />,
        children: [
          {
            path: '/fortune-wheel',
            async lazy() {
              const FortuneWheelComponent =
                await import('./components/ui/FortuneWheel/FortuneWheel.js');
              return {Component: FortuneWheelComponent.default};
            },
          },
          {
            path: '/communities/:communityId/settings',
            async lazy() {
              const CommunitySettingsPage =
                await import('./pages/community-settings/CommunitySettingsPage.js');
              return {Component: CommunitySettingsPage.default};
            },
          },
          {
            path: '/profile/',
            async lazy() {
              const EditProfilePage =
                await import('./pages/profile/EditProfilePage.js');
              return {Component: EditProfilePage.default};
            },
          },
          {
            path: '/materials',
            async lazy() {
              const ArticleListPage =
                await import('./pages/materials/MaterialsPage.js');
              return {Component: ArticleListPage.default};
            },
          },
          {
            path: '/articles/new',
            async lazy() {
              const ArticleCreatePage =
                await import('./pages/materials/article/ArticleCreatePage.js');
              return {Component: ArticleCreatePage.default};
            },
          },
          {
            path: '/articles/:articleId/edit',
            async lazy() {
              const ArticleEditPage =
                await import('./pages/materials/article/ArticleEditPage.js');
              return {Component: ArticleEditPage.default};
            },
          },
          {
            path: '/article-categories/new',
            async lazy() {
              const ArticleCategoryCreatePage =
                await import('./pages/materials/article-gategory/ArticleCategoryCreatePage.js');
              return {Component: ArticleCategoryCreatePage.default};
            },
          },
          {
            path: '/article-categories/:categoryId/edit',
            async lazy() {
              const ArticleCategoryEditPage =
                await import('./pages/materials/article-gategory/ArticleCategoryEditPage.js');
              return {Component: ArticleCategoryEditPage.default};
            },
          },

          {
            path: '/users',
            async lazy() {
              const UsersPage = await import('./pages/users/UsersPage.js');
              return {Component: UsersPage.default};
            },
          },
          {
            path: '/scheduled-posts',
            async lazy() {
              const ScheduledPostsPage =
                await import('./pages/scheduled-posts/ScheduledPostsPage.js');
              return {Component: ScheduledPostsPage.default};
            },
          },
          {
            path: '/scheduled-posts/challenge/create',
            async lazy() {
              const ChallengeCreatePage =
                await import('./pages/scheduled-posts/ChallengeCreatePage.js');
              return {Component: ChallengeCreatePage.default};
            },
          },
          {
            path: '/scheduled-posts/challenge/:id',
            async lazy() {
              const ChallengeEditPage =
                await import('./pages/scheduled-posts/ChallengeEditPage.js');
              return {Component: ChallengeEditPage.default};
            },
          },
          {
            path: '/scheduled-posts/coach-post/:id',
            async lazy() {
              const CoachPostEditPage =
                await import('./pages/scheduled-posts/CoachPostEditPage.js');
              return {Component: CoachPostEditPage.default};
            },
          },
          {
            path: '/scheduled-posts/coach-post/create',
            async lazy() {
              const CoachPostCreatePage =
                await import('./pages/scheduled-posts/CoachPostCreatePage.js');
              return {Component: CoachPostCreatePage.default};
            },
          },
          {
            path: '/emails',
            async lazy() {
              const EmailsPage = await import('./pages/emails/EmailsPage.js');
              return {Component: EmailsPage.default};
            },
          },
          {
            path: '/retention',
            async lazy() {
              const RetentionPage =
                await import('./pages/retention/RetentionPage.js');
              return {Component: RetentionPage.default};
            },
          },
          {
            path: '/animations',
            async lazy() {
              const RetentionPage =
                await import('./pages/animations/AnimationsPage.js');
              return {Component: RetentionPage.default};
            },
          },
          {
            path: '/video-processing-jobs',
            async lazy() {
              const VideoProcessingJobsPage =
                await import('./pages/video-processing-jobs/VideoProcessingJobsPage.js');
              return {Component: VideoProcessingJobsPage.default};
            },
          },
          {
            path: '/billing',
            async lazy() {
              const BillingPage =
                await import('./pages/billing/BillingPage.js');
              return {Component: BillingPage.default};
            },
          },
          {
            path: '/ai-guidance-logs',
            async lazy() {
              const AiGuidanceLogs =
                await import('./pages/ai-guidance-logs/AiGuidanceLogs.js');
              return {Component: AiGuidanceLogs.default};
            },
          },
          {
            path: '/coaching-plans',
            async lazy() {
              const CoachingPlansPage =
                await import('./pages/coaching/CoachingPlansPage.js');
              return {Component: CoachingPlansPage.default};
            },
          },
          {
            path: '/animations/upload',
            async lazy() {
              const SpinnerGenerator =
                await import('./pages/animations/AnimationGenerator.js');
              return {Component: SpinnerGenerator.default};
            },
          },
          {
            path: '/animations/:animationId',
            async lazy() {
              const SpinnerGenerator =
                await import('./pages/animations/AnimationGenerator.js');
              return {Component: SpinnerGenerator.default};
            },
          },
          {
            path: '/lottie-animations',
            async lazy() {
              const SpinnerGenerator =
                await import('./pages/LottieAnimations.js');
              return {Component: SpinnerGenerator.default};
            },
          },
          {
            path: '/question-sets',
            async lazy() {
              const QuestionSetListPage =
                await import('./pages/games/quiz/QuestionSetListPage.js');
              return {Component: QuestionSetListPage.default};
            },
          },
          {
            path: '/question-sets/new',
            async lazy() {
              const QuestionSetPage =
                await import('./pages/games/quiz/QuestionSetPage.js');
              return {Component: QuestionSetPage.default};
            },
          },
          {
            path: '/question-sets/:setId',
            async lazy() {
              const QuestionSetPage =
                await import('./pages/games/quiz/QuestionSetPage.js');
              return {Component: QuestionSetPage.default};
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
          {path: '/register/code', element: <RegisterCodePage />},
          {path: '/register/user', element: <RegisterUserPage />},
        ],
      },
      {path: '/forgot-password', element: <ForgotPasswordPage />},
      {path: '/auth-callback', element: <AuthCallbackPage />},
      {path: '/confirm-email', element: <EmailConfirmCallbackPage />},
      {
        path: '/diploma',
        async lazy() {
          const StrengthDiplomaPage =
            await import('./pages/strength-diploma/StrengthDiplomaPage.js');
          return {Component: StrengthDiplomaPage.default};
        },
      },
      {path: '/games/join', element: <GroupGameJoinPage />},
      {path: '/games/:gameId/host', element: <GroupGamesLobbyPage />},
      {path: '/games/sprints/:sprintId/host', element: <HostSprintPage />},
      {path: '/games/sprints/:sprintId/player', element: <PlayerSprintPage />},
      {
        path: '/games/memory-games/:gameId/host',
        element: <HostMemoryGamePage />,
      },
      {
        path: '/games/memory-games/:gameId/player',
        element: <PlayerMemoryGamePage />,
      },
      {
        path: '/games/quizzes/:quizId/host',
        element: (
          <CurrentUserProvider>
            <ActiveGroupProvider>
              <HostQuizPage />
            </ActiveGroupProvider>
          </CurrentUserProvider>
        ),
      },
      {
        path: '/games/quizzes/join',
        element: <JoinQuizPage />,
      },
      {
        path: '/games/quizzes/:quizId/player',
        element: <PlayerQuizPage />,
      },
      {
        path: '/*',
        async lazy() {
          const NotFoundPage = await import('./pages/NotFoundPage.js');
          return {Component: NotFoundPage.default};
        },
      },
    ],
  },
]);
