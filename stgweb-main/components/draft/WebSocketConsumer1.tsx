import useWebSocket from '@/hooks/useWebSocket';

export const WebSocketConsumer1 = () => {
  useWebSocket({
    uid: 'sub1',
    collection: 'swl_moment',
    query: {
      fields: ['id', 'strengths.strength.slug'],
      filter: {
        swl_item: {
          swl_wall_links: {
            swl_wall: {
              id: {
                _eq: '0221addc-ccbf-4acc-884a-0b381c7c35d1',
              },
            },
          },
        },
      },
    },
    events: {
      create() {
        console.log('created from 1!');
      },
    },
  });

  return (
    <div>
      <h1>Last Message (consumer 1)</h1>
    </div>
  );
};
