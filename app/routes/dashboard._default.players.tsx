import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { getPlayers } from '~/services/auth/getPlayers.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return await getPlayers(request);
}

export default function PlayersLayout() {
  const { players } = useLoaderData<typeof loader>();
  //TODO: give user feedback if there are no players
  invariant(players, 'No players found');
  return (
    <div>
      {players.map(({ id, firstName, lastName, primary }) => (
        <div
          key={id}
          className="flex flex-row">
          <p>
            {firstName} {lastName} {primary.toString()}
          </p>
          <Button>
            <Link
              to={$path('/dashboard/players/delete/:playerId', {
                playerId: id,
              })}>
              Delete
            </Link>
          </Button>
        </div>
      ))}
      <Button>
        <Link to={$path('/dashboard/players/add')}>Add a Player</Link>
      </Button>
      <Outlet />
    </div>
  );
}
