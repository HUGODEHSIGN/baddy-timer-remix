import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import { db } from '~/db/drizzle.server';
import { courtTable } from '~/db/schemas/court.server';
import { getAdminPrefs } from '~/services/prefs/adminPrefs';

export async function loader({ request }: LoaderFunctionArgs) {
  const adminPrefs = await getAdminPrefs(request);
  const { locationId } = adminPrefs;

  return await db
    .select()
    .from(courtTable)
    .where(eq(courtTable.locationId, locationId));
}

export default function AdminDashboardCourtsPage() {
  const courts = useLoaderData<typeof loader>();

  return (
    <>
      {courts.map(({ id, name }) => (
        <div key={id}>
          {name}
          <Button>
            <Link
              to={$path('/dashboard/admin/courts/delete/:courtId', {
                courtId: id,
              })}>
              Delete
            </Link>
          </Button>
        </div>
      ))}
      <Button>
        <Link to={$path('/dashboard/admin/courts/add')}>Add Court</Link>
      </Button>
      <Outlet />
    </>
  );
}
