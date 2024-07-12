import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import Navbar from '~/components/Navbar';
import { getPlayers } from '~/services/auth/getPlayers.server';

const exampleMenu = [
  { display: 'Players', to: $path('/dashboard/players') },
  { display: 'Settings', to: $path('/dashboard/settings') },
];

export function loader({ request }: LoaderFunctionArgs) {
  const players = getPlayers(request);
  return players;
}
export default function DefaultDashboardLayout() {
  const { players } = useLoaderData<typeof loader>();
  invariant(players, 'Players not found');
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
