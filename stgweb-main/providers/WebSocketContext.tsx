'use client';

import React, {type FunctionComponent, createContext, useState} from 'react';
import {DATA_API_URL} from '@/constants.mjs';
import {refreshAuthIfExpired} from '@/lib/directus';
import {delay, retry} from '@/lib/utils';
import useLegacyEffect from '@/hooks/use-legacy-effect';

const dataApiProtocol = DATA_API_URL.startsWith('https') ? 'https' : 'http';
const wsProtocol = dataApiProtocol === 'https' ? 'wss' : 'ws';
const dataApiHostAndPath = DATA_API_URL.replace(`${dataApiProtocol}://`, '');
const wsServerUrl = `${wsProtocol}://${dataApiHostAndPath}/websocket`;

const DEBUG = process.env.NODE_ENV === 'development';

type WebSocketContextInterface = {
  socket: WebSocket | undefined;
};

export const WebSocketContext = createContext<
  WebSocketContextInterface | undefined
>(undefined);

type WebSocketProviderProps = {
  readonly children: React.ReactNode;
};

const getFreshAuthToken = async () => {
  if (DEBUG) {
    console.log('WebSocketContext: try to get auth token');
  }

  // Get a new token before connecting to make sure the refresh logic with pings
  // works as expected and tokens don't get to expire.
  try {
    await retry(async () => {
      if (DEBUG) {
        console.log('WebSocketContext: attempt directus.auth.refresh');
      }

      refreshAuthIfExpired();
    }, 10);
  } catch (error) {
    if (DEBUG) {
      console.log('WebSocketContext: error refreshing auth token', error);
    }

    return;
  }

  // Even we get a fresh token from directus succesfully, we still need a bit of
  // delay to make sure that it is available from localStorage...
  await delay(1000);
};

const authenticateSocketConnection = (socket: WebSocket | undefined) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    if (DEBUG) {
      console.log('WebSocketContext: try to authenticate socket connection with a token:', token.slice(0, 5), '...');
    } // prettier-ignore

    socket?.send(
      JSON.stringify({
        type: 'auth',
        access_token: token,
      }),
    );
  } else if (DEBUG) {
    console.log('WebSocketContext: no token, cannot continue');
  }
};

export const WebSocketContextProvider: FunctionComponent<
  WebSocketProviderProps
> = ({children}) => {
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  useLegacyEffect(() => {
    let newSocket: WebSocket | undefined;

    const socketMessageListener = async (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (DEBUG) {
        console.log('WebSocketContext: message', data);
      }

      if (
        data.type === 'auth' &&
        data.status === 'ok' && // this basically initiates all the listeners queued up, so only do it once we are authenticated
        !socket
      ) {
        setSocket(newSocket);
      }

      if (data.type === 'ping') {
        // this is a bit odd, but it seems that the ping that the server sends
        // needs to be responded, otherwise connection will be closed...
        newSocket?.send(JSON.stringify({type: 'pong'}));
        return;
      }

      if (
        data.type === 'auth' &&
        data.status === 'error' &&
        data.error.code === 'AUTH_FAILED'
      ) {
        // this can happen sometimes if the refresh token happens to be
        // expired. In that case we want to wait a while, try to get a fresh
        // token and reconnect
        // await delay(5000)
        await getFreshAuthToken();
        // run('auth failed')
        authenticateSocketConnection(newSocket);
      }

      // if we get notified that the token has expired, we need to request a new one and reconnect
      if (
        data.type === 'auth' &&
        data.status === 'error' &&
        data.error.code === 'TOKEN_EXPIRED'
      ) {
        if (DEBUG) {
          console.log('WebSocketContext: token expired, attempting to reconnect');
        } // prettier-ignore

        await getFreshAuthToken();
        authenticateSocketConnection(newSocket);
      }
    };

    const socketOpenListener = async () => {
      authenticateSocketConnection(newSocket);
    };

    const socketCloseListener = async (data: any) => {
      if (DEBUG) {
        console.log('WebSocketContext: socket connection closed', data.timeStamp);
      } // prettier-ignore

      await delay(5000);
      await getFreshAuthToken();
      run('closed');
    };

    const run = async (reason: string) => {
      if (DEBUG) {
        console.log('WebSocketContext: call the run function because', reason);
      } // prettier-ignore

      newSocket?.removeEventListener('message', socketMessageListener);
      newSocket?.removeEventListener('close', socketCloseListener);
      newSocket?.removeEventListener('open', socketOpenListener);
      newSocket = undefined;

      // await getFreshAuthToken()
      newSocket = new WebSocket(wsServerUrl);

      newSocket.addEventListener('open', socketOpenListener);
      newSocket.addEventListener('close', socketCloseListener);
      newSocket.addEventListener('message', socketMessageListener);
    };

    retry(async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        run('initiated');
      } else {
        throw new Error('no token');
      }
    }, 10);

    return () => {
      newSocket?.close();
    };
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <WebSocketContext.Provider value={{socket}}>
      {children}
    </WebSocketContext.Provider>
  );
};
