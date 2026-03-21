import useWebSocket from '@/hooks/useWebSocket';

export const WebSocketConsumer2 = () => {
  useWebSocket({
    uid: 'sub2',
    collection: 'swl_moment',
    query: {
      filter: {
        swl_item: {
          swl_wall_links: {
            swl_wall: {
              id: {
                _eq: '091f592f-4c3f-454e-bf7c-de6567310d29',
              },
            },
          },
        },
      },
    },
    events: {
      create() {
        console.log('created from 2!');
      },
    },
  });

  return (
    <div>
      <h1>Last Message (consumer 2)</h1>
    </div>
  );
};
