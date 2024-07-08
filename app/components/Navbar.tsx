import { Link } from '@remix-run/react';
import { PropsWithChildren } from 'react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';

type NavLinkProps = PropsWithChildren & {
  to: string;
};

function NavLink({ children, to }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="text-muted-foreground transition-colors hover:text-foreground">
      {children}
    </Link>
  );
}

export default function Navbar() {
  return (
    <>
      <header className="bg-card border-b p-4 flex flex-row gap-4 items-center">
        <Button variant="outline">Player Select</Button>
        <menu className="flex flex-row gap-2">
          <NavLink to={$path('/dashboard/players')}>Players</NavLink>
          <NavLink to={$path('/dashboard/settings')}>Settings</NavLink>
        </menu>
      </header>
    </>
  );
}
