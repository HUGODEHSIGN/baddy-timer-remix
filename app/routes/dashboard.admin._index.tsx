import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import getLocations from '~/services/auth/getLocations.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return getLocations(request);
}

export default function AdminDashboardIndex() {
  const locations = useLoaderData<typeof loader>();
  return (
    <>
      <div>
        {locations.map(({ id, name }) => (
          <Button
            key={id}
            asChild>
            <Link to={$path('/dashboard/admin', { location: id })}>{name}</Link>
          </Button>
        ))}
      </div>
    </>
  );
}
