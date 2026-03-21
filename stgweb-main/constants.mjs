// if for some reason NODE_ENV or DEPLOYMENT_ENV isn't set correctly, default to
// localhost (so that these won't ever be "undefined")
let publicDomain = 'localhost';
let sharedCookieDomain = 'localhost'
// Uncomment lines below if testing redirects (NOTE: .app domains won't work for
// local testing since they always redirect to HTTPS)
// publicDomain = 'dev.seethegood.fi';
// sharedCookieDomain = '.seethegood.fi'
let shortDomain = 'dev.stg.fun'
let publicUrl = `http://${publicDomain}:3000`;
let dataApiUrl = 'http://localhost:8055';
let environment = 'development';

// staging runs at beta.seethegood.app
// it can be accessed with a short domain beta.stg.fun that takes users to the
// language selection page
if (process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'staging') {
  publicDomain = 'beta.seethegood.app';
  sharedCookieDomain = '.seethegood.app'
  shortDomain = 'beta.stg.fun'
  publicUrl = `https://${publicDomain}`;
  dataApiUrl = 'https://stg-staging.fly.dev';
  environment = 'staging';
}

// production runs at my.seethegood.app
// it can be accessed with a short domain stg.fun that takes users to the
// language selection page
if (process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'production') {
  publicDomain = 'my.seethegood.app';
  sharedCookieDomain = '.seethegood.app'
  shortDomain = 'stg.fun'
  publicUrl = `https://${publicDomain}`;
  dataApiUrl = 'https://data-api.seethegood.app';
  environment = 'production';
}

export const PUBLIC_DOMAIN = publicDomain;
export const SHORT_DOMAIN = shortDomain;

export const PUBLIC_URL = publicUrl;
export const DATA_API_URL = dataApiUrl;

export const SHARED_COOKIE_DOMAIN = sharedCookieDomain;

export const IS_DEVELOPMENT_OR_STAGING
  = environment === 'development' || environment === 'staging';

export const IS_STAGING_OR_PRODUCTION
  = environment === 'staging' || environment === 'production';

// useful for for when debugging production builds locally (yarn build && yarn start && roll up ngroks)
// export const PUBLIC_URL = "https://stgv2-web.eu.ngrok.io"
// export const DATA_API_URL = "https://stgv2-data-api.eu.ngrok.io"
// export const PUBLIC_URL = "http://192.168.1.101:3000"
// export const DATA_API_URL = "http://192.168.1.101:8055"

export const DATA_API_REWRITE_DESTINATION = `${DATA_API_URL}/:path*`;

// These magic value come from the database. It's easier to have them available
// directly than to have to query for them every time, since they dont change...
export const USER_ROLE_ID = 'ba8a13aa-4991-4fef-a0c0-a525e70fa2f5';
export const ORG_CONTROLLER_ROLE_ID = '3818d025-2f4a-4a4e-880d-83ac46a9fcd9';
export const USER_SWL_MEDIA_PARENT_FOLDER_ID = '38886e02-9d28-43a0-8afd-9016d5eb4375'; // prettier-ignore
export const ORG_SWL_MEDIA_PARENT_FOLDER_ID = '5068838b-0abd-4eb6-b052-635ae3ba5d92'; // prettier-ignore
export const AVATAR_FOLDER_ID = 'a38795ba-36c4-4dd6-acd7-4355ae0ba2c9';

export const SUPPORT_EMAIL = 'support@seethegood.app';

// prettier-ignore
export const PATHS = {
  // starting as a new user (the order these are stepped through)
  joinOrganizationStart: '/start/join', // short code (unauthenticated)
  joinOrganizationStep1: '/start/hello', // name (unauthenticated initially)
  strengthsOnboardingStart: '/onboard/strengths', // text
  strengthsOnboardingStep1: '/onboard/strengths/step-1', // text
  strengthsOnboardingStep2: '/onboard/strengths/step-2', // text
  strengthsOnboardingStep3: '/onboard/strengths/step-3', // strength picker
  strengthsOnboardingStep4: '/onboard/strengths/step-4', // text
  strengthsOnboardingStep5: '/onboard/strengths/step-5', // core strengths
  strengthsOnboardingStep6: '/onboard/strengths/step-6', // reward
  strengthsOnboardingThanks: '/onboard/strengths/thanks', // NOTE: used for a single test usecase, can be removed after 22.8.2023
  profileOnboardingStep1: '/onboard/profile/step-1', // profile image
  profileOnboardingStep2: '/onboard/profile/step-2', // email + password
  // dashboard
  dashboard: '/dashboard',
  home: '/dashboard/home',
  homeMoments: '/dashboard/home/moments',
  homeGroups: '/dashboard/home/groups',
  homeGroupsCreateGroup: '/dashboard/home/groups/create-group',
  homeTools: '/dashboard/home/tools',
  homeMembers: '/dashboard/home/members',
  group: '/dashboard/group/[groupSlug]',
  groupStrengths: '/dashboard/group/[groupSlug]/strengths',
  groupStrengthDetailsModal: '/dashboard/modal/group/[groupSlug]/strength-details/[strength]',
  groupMoments: '/dashboard/group/[groupSlug]/moments',
  groupTools: '/dashboard/group/[groupSlug]/tools',
  community: '/dashboard/community', // @TODO: remove
  library: '/dashboard/library', // @TODO: move under home
  libraryRedirect: '/dashboard/library-redirect',
  inbox: '/dashboard/profile/inbox',
  inboxMomentDetails: '/dashboard/modal/profile/inbox/moment-details/[momentId]',
  profile: '/dashboard/profile',
  profileStrengths: '/dashboard/profile/strengths',
  profileMoments: '/dashboard/profile/moments',
  profileStrengthDetailsModal: '/dashboard/modal/profile/strength-details/[strength]',
  user: '/dashboard/user/[userId]',
  seeTheGoodModal: '/dashboard/modal/see-the-good/start',
  seeTheGoodModalPickUser: '/dashboard/modal/see-the-good/pick-user',
  seeTheGoodModalPickStrength: '/dashboard/modal/see-the-good/pick-strength',
  seeTheGoodModalCustomize: '/dashboard/modal/see-the-good/customize',
  seeTheGoodModalComplete: '/dashboard/modal/see-the-good/complete',
  organizationSettingsGeneral: '/dashboard/settings/organization/general',
  organizationSettingsMembers: '/dashboard/settings/organization/members',
  accountSettingsProfile: '/dashboard/modal/settings/account/profile',
  accountSettingsLanguage: '/dashboard/modal/settings/account/language',
  accountSettingsNotifications: '/dashboard/modal/settings/account/notifications',
  // games - strength session
  strengthSessionWsevent: '/games/session/wsevent',
  strengthSessionCreate: '/games/session/host/create',
  strengthSessionCreateGroupAndSession: '/games/session/host/create/create-group-and-session',
  strengthSessionCreateSessionWithGroup: '/games/session/host/create/create-session-with-group',
  strengthSessionJoinView: '/games/session/host/[sessionId]/join',
  strengthSessionActiveView: '/games/session/host/[sessionId]/view',
  strengthSessionCompleteCheck: '/games/session/host/[sessionId]/complete-check',
  strengthSessionCompleteTransition: '/games/session/host/[sessionId]/complete-transition',
  strengthSessionStats: '/games/session/host/[sessionId]/stats',
  strengthSessionStatsParticipants: '/games/session/host/[sessionId]/stats/participants',
  strengthSessionPlayerHello: '/games/session/player/[sessionId]/hello',
  strengthSessionPlayerLobby: '/games/session/player/[sessionId]/lobby',
  strengthSessionPlayerGroupStrengthsStart: '/games/session/player/[sessionId]/group-strengths/start',
  strengthSessionPlayerGroupStrengths: '/games/session/player/[sessionId]/group-strengths',
  strengthSessionPlayerOwnStrengthsStart: '/games/session/player/[sessionId]/own-strengths/start',
  strengthSessionPlayerOwnStrengths: '/games/session/player/[sessionId]/own-strengths',
  strengthSessionPlayerOwnStrengthsComplete: '/games/session/player/[sessionId]/own-strengths/complete',
  strengthSessionPlayerPeerStrengthsStart: '/games/session/player/[sessionId]/peer-strengths/start',
  strengthSessionPlayerPeerStrengths: '/games/session/player/[sessionId]/peer-strengths',
  strengthSessionPlayerPeerStrengthsComplete: '/games/session/player/[sessionId]/peer-strengths/complete',
  strengthSessionPlayerBonusStart: '/games/session/player/[sessionId]/bonus/start',
  strengthSessionPlayerBonus: '/games/session/player/[sessionId]/bonus',
  strengthSessionPlayerStats: '/games/session/player/[sessionId]/stats',
  strengthSessionPlayerCongrats: '/games/session/player/[sessionId]/congrats',
  strengthSessionDevAddPlayer: '/games/session/dev/add-player',
  // auth
  moveAuthTokenFromServerToClient: '/auth/server-to-client',
  authRefreshInit: '/auth/auth-refresh/init',
  authRefresh: '/auth/auth-refresh',
  logout: '/auth/logout',
  loginRedirect: '/auth/login-redirect',
  getOwnGroupLinks: '/auth/get-own-group-links',
  switchGroup: '/auth/switch-group',
  getOwnOrganizationLinks: '/auth/get-own-organization-links',
  switchOrganization: '/auth/switch-organization',
  organizationPicker: '/organization-picker',
  // misc
  setLocale: '/utils/set-locale/[locale]',
  postToUsersWall: '/utils/post-to-users-wall',
  // login
  login: '/login',
  loginForgottenPassword: '/login/forgotten-password',
  loginForgottenPasswordSendLoginLink: '/login/forgotten-password/send-login-link',
  loginForgottenPasswordCheckYourEmail: '/login/forgotten-password/check-your-email',
  // reset password
  passwordReset: '/password-reset',
  passwordResetCheckToken: '/password-reset/check-token',
  passwordResetResetPassword: '/password-reset/reset-password',
  // peek
  peekMomentToken: '/peek/moment/[token]',
  peekMoment: '/peek/moment',
  peekMomentReveal: '/peek/moment/reveal',
  // errors
  invalidSession: '/errors/invalid-session',
  tryAgain: '/errors/try-again',
};

export const MOBILE_WITH_BOTTOM_NAVI_BREAKPOINT = 767;
export const MOBILE_WITHOUT_RIGHT_SIDEBAR_BREAKPOINT = 1023;
