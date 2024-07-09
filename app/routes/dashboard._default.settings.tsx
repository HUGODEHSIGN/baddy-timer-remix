import { Link, Outlet } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';

export default function DefaultSettingsLayout() {
  return (
    <>
      <div className="m-8 grid grid-cols-12">
        <aside className="col-span-3 flex flex-col gap-8">
          <h1 className="text-4xl font-bold">Settings</h1>
          <ul className="flex flex-col gap-4">
            <li>General</li>
            <li>Players</li>
            <li>
              <Button variant="link">
                <Link to={$path('/dashboard/settings/admin')}>Admin</Link>
              </Button>
            </li>
            <li>Advanced</li>
            <li>Bugs</li>
          </ul>
        </aside>
        <main className="col-span-9">
          <Outlet />
        </main>
      </div>
    </>
  );
}
