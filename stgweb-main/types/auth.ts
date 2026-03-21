// User type allows the middleware (or UI) to make decisions on what to do based
// on the type of user we are dealing with. This is necessary due to the fact
// that we have different kind of users logged in to the system in the same way
// (using the same cookies / localStorage items for auth information), but they
// should get access to different parts of the platform. Directus deals with the
// authorization and authentication aspects, so the user_type we store to a
// cookie doesn't have any direct security implications, it's just to make sure
// we can deal with the logged in users in an expected way. The logic for making
// sure user is in the correct place is handled in middleware.ts. The user is
// redirected to an "error" page if they happen to stumble upon a place they are
// not supposed to visit.

// "dashboard-user" is a type of user that should be able to access /dashboard
// and some other parts of the platform (like /games). This is the most common
// type of a user.

// "org-controller-user" is a user that should be able to access the admin
// dashboard (/admin)

// "strength-session-user" is a type of user that gets created when joining a
// "strength sprint". This type of a user should only be able to access
// /games/session

export type UserType =
  | 'dashboard-user'
  | 'org-controller-user'
  | 'strength-session-user';
