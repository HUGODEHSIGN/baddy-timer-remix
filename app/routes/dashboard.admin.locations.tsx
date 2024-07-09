import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { db } from '~/db/drizzle.server';
import { adminTable } from '~/db/schemas/admin.server';
import { locationTable } from '~/db/schemas/location.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await validateRequest(request);

  try {
    invariant(user, 'Unauthorized');
    const result = await db
      .select({ location: locationTable })
      .from(adminTable)
      .where(eq(adminTable.userId, user.id))
      .leftJoin(locationTable, eq(adminTable.locationId, locationTable.id));
    return result;
  } catch (error) {
    console.error(error);
  }
}

export default function AdminLocationsPage() {
  const result = useLoaderData<typeof loader>();
  return (
    <>
      {result.map(({ location }) => (
        <p key={location?.id}>{location?.name}</p>
      ))}
      <p>add a location</p>
      <Button asChild>
        <Link to={$path('/dashboard/admin/locations/add')}>Add</Link>
      </Button>
      <Outlet />
    </>
  );
}
