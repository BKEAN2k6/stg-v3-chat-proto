import {useRef} from 'react';
import jwtDecode from 'jwt-decode';

const useAuth = () => {
  const loggedInUserIdRef = useRef<string | undefined>(undefined);
  const loggedInUserRoleRef = useRef<string | undefined>(undefined);

  const inClient = typeof window !== 'undefined';

  const getLoggedInUserRole = () => {
    if (!inClient) {
      return null;
    }

    //
    if (loggedInUserRoleRef.current) {
      return loggedInUserRoleRef.current;
    }

    //
    const tokenContent = readTokenContent();
    const userRole = tokenContent?.role ?? undefined;
    loggedInUserRoleRef.current = userRole;
    return userRole;
  };

  const getLoggedInUserId = () => {
    if (!inClient) {
      return null;
    }

    //
    if (loggedInUserIdRef.current) {
      return loggedInUserIdRef.current;
    }

    //
    const tokenContent = readTokenContent();
    const userId = tokenContent?.id ?? undefined;
    loggedInUserIdRef.current = userId;
    return userId;
  };

  const readTokenContent = (): Record<string, string> | undefined => {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      return undefined;
    }

    // NOTE: we don't verify the token here! That's taken care of by the server.
    const tokenContent = jwtDecode(authToken);
    // token content example: {
    //   admin_access: null
    //   app_access: null
    //   exp: 1689326584
    //   iat: 1689326284
    //   id: "7d272ba0-c473-439b-ab08-eaf4482edffc"
    //   iss: "directus"
    //   role: null
    // }
    return tokenContent as Record<string, string>;
  };

  return {
    // this is quite simplistic, but enough for basic UI usecases where we don't
    // want to do any extra work related to this, just have a basic sanity check
    // whether or not user is logged in which basically always works (unless
    // user is in some weird state...)
    isLoggedIn: inClient && localStorage.getItem('auth_token') !== null,
    getLoggedInUserId,
    getLoggedInUserRole,
  };
};

export default useAuth;
