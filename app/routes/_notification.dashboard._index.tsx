import { Link } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';

export default function DashboardPage() {
  return (
    <>
      <Button>
        <Link to={$path('/dashboard/players')}>Players</Link>
      </Button>
    </>
  );
}
