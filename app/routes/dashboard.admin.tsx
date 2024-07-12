import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, Outlet, useFetcher, useLoaderData } from '@remix-run/react';
import { and, eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import Navbar from '~/components/Navbar';
import { db } from '~/db/drizzle.server';
import { adminTable } from '~/db/schemas/admin.server';
import getLocations from '~/services/auth/getLocations.server';
import validateRequest from '~/services/auth/validateRequest.server';
import { adminPrefs, getAdminPrefs } from '~/services/prefs/adminPrefs';

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await validateRequest(request);
  invariant(user, 'Unauthorized');
  const locations = await getLocations(request);

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await adminPrefs.parse(cookieHeader)) ?? {};

  if (!cookie.locationId) cookie.locationId = locations[0].id;

  const admin = await db
    .select()
    .from(adminTable)
    .where(
      and(
        eq(adminTable.userId, user.id),
        eq(adminTable.locationId, cookie.locationId)
      )
    );

  if (!admin.length) cookie.locationId = locations[0].id;

  return json(
    { locations, locationId: cookie.locationId },
    {
      headers: {
        'Set-Cookie': await adminPrefs.serialize(cookie),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const locationId = formData.get('locationId');

  // const cookieHeader = request.headers.get('Cookie');
  // const cookie = await adminPrefs.parse(cookieHeader);
  const adminPref = await getAdminPrefs(request);

  adminPref.locationId = locationId;
  return json('success', {
    headers: {
      'Set-Cookie': await adminPrefs.serialize(adminPref),
    },
  });
}

export default function AdminDashboardLayout() {
  const { locations, locationId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const selectOptions = locations.map(({ id, name }) => ({
    id,
    value: id,
    display: name,
  }));

  const menu = [
    {
      display: 'Locations',
      to: $path('/dashboard/admin/locations'),
    },
    {
      display: 'Courts',
      to: $path('/dashboard/admin/courts'),
    },
    {
      display: 'Settings',
      to: $path('/dashboard/admin/settings'),
    },
  ];

  function handleChange(value: string) {
    fetcher.submit({ locationId: value }, { method: 'POST' });
  }

  return (
    <>
      <Navbar
        logo="Bad:Admin"
        menuItems={menu}
        selectOptions={selectOptions}
        selectValue={locationId}
        onValueChange={handleChange}>
        <fetcher.Form method="post">
          <Navbar.Select />
        </fetcher.Form>
        <Navbar.Menu />
        <Navbar.Logo />
      </Navbar>
      <Outlet />
    </>
  );
}
