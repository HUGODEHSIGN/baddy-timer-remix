import type { MetaFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';

import { socket } from '~/socket/socket';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<string[]>([]);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: string) {
      console.log(value);
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div>
      <div>{isConnected.toString()}</div>
      <div>
        {fooEvents.map((value) => (
          <p key={value}>{value}</p>
        ))}
      </div>
      <Button onClick={() => socket.emit('foo', 'hello world!')}>
        connect
      </Button>
    </div>
  );
}
