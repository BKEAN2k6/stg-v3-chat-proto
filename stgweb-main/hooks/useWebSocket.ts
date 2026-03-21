'use client';

import {useCallback, useContext} from 'react';
import useLegacyEffect from './use-legacy-effect';
import {WebSocketContext} from '@/providers/WebSocketContext';

type UseWebSocketOptions = {
  uid: string;
  collection: string;
  query?: {
    fields?: string[];
    filter?: any;
    limit?: number;
    sort?: string[];
  };
  events?: {
    create?: (data: any) => void;
    update?: (data: any) => void;
    delete?: (data: any) => void;
  };
};

export default function useWebSocket(parameters: UseWebSocketOptions) {
  const {uid, collection, query, events} = parameters;
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error(
      'useWebSocket must be used within a WebSocketContextProvider',
    );
  }

  const {socket} = context;

  const handleMessage = useCallback(
    (message: any) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.uid === uid) {
        if (parsedMessage.event === 'create') {
          events?.create?.(parsedMessage);
        }

        if (parsedMessage.event === 'update') {
          events?.update?.(parsedMessage);
        }
        // @TODO handle other events
      }
    },
    [uid, events],
  );

  useLegacyEffect(() => {
    const handler = (message: any) => {
      handleMessage(message.data);
    };

    if (socket) {
      const subscriptionData = JSON.stringify({
        uid,
        type: 'subscribe',
        collection,
        query,
      });
      socket?.send(subscriptionData);
      socket?.addEventListener('message', handler);
    }

    return () => {
      socket?.send(
        JSON.stringify({
          uid,
          type: 'unsubscribe',
        }),
      );
      socket?.removeEventListener('message', handler);
    };
  }, [socket]);

  return {socket};
}
