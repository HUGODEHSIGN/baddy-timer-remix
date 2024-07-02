import { LoaderFunctionArgs } from '@remix-run/node';
import { json, Link, Outlet, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { getPlayers } from '~/services/auth/getPlayers';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, players, headers } = await getPlayers(request);
  invariant(session && user, 'User not found');

  return json({ players }, { headers });
}

export default function PlayersLayout() {
  const { players } = useLoaderData<typeof loader>();
  //TODO: give user feedback if there are no players
  invariant(players, 'No players found');
  return (
    <div>
      {players.map(({ id, firstName, lastName, primary }) => (
        <p key={id}>
          {firstName} {lastName}
        </p>
      ))}
      <Button>
        <Link to={$path('/dashboard/players/add')}>Add a Player</Link>
      </Button>
      <Outlet />
    </div>
  );
}
