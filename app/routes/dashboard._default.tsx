import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, redirect, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import Navbar from '~/components/Navbar';
import {
  getPlayers,
  getPrimaryPlayer,
} from '~/services/auth/getPlayers.server';

const exampleMenu = [
  { display: 'Players', to: $path('/dashboard/players') },
  { display: 'Settings', to: $path('/dashboard/settings') },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { primaryPlayer } = await getPrimaryPlayer(request);

  if (!primaryPlayer) throw redirect($path('/get-started'));

  const players = await getPlayers(request);
  return players;
}
export default function DefaultDashboardLayout() {
  const { players } = useLoaderData<typeof loader>();

  const selectOptions = players.map(({ id, firstName, lastName }) => ({
    id,
    value: id,
    display: `${firstName} ${lastName}`,
  }));

  return (
    <>
      <Navbar
        logo="Player"
        menuItems={exampleMenu}
        selectOptions={selectOptions}>
        <Navbar.Select />
        <Navbar.Menu />
        <Navbar.Logo />
      </Navbar>
      <Outlet />
    </>
  );
}
