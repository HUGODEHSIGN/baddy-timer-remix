import { Link } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export default function SettingsAdminTab() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>This settings page is locked</CardTitle>
          <CardDescription>
            Admin accounts can create gym locations for players to join
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-row gap-4">
          <Button>
            <Link to={$path('/get-started/admin')}>Become an admin</Link>
          </Button>
          <Button variant="outline">More info</Button>
        </CardFooter>
      </Card>
    </>
  );
}
