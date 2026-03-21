import useWebSocket from '@/hooks/useWebSocket';

export const WebSocketConsumer3 = () => {
  useWebSocket({
    uid: 'sub3',
    collection: 'swl_moment',
    events: {
      create() {
        console.log('created from 3!');
      },
    },
  });

  return (
    <div>
      <h1>Last Message (consumer 3)</h1>
    </div>
  );
};
