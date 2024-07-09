import { Link } from '@remix-run/react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { Badge } from '~/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { SelectPlayer } from '~/db/schemas/player.server';

type NavLinkProps = PropsWithChildren & {
  display: string;
  to: string;
};

function NavLink({ display, to }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="text-muted-foreground transition-colors hover:text-foreground">
      {display}
    </Link>
  );
}

type NavbarProps = PropsWithChildren & {
  logo: string;
  selectOptions: Pick<
    SelectPlayer,
    'id' | 'firstName' | 'lastName' | 'primary'
  >[];
  menuItems: NavLinkProps[];
};

const NavbarContext = createContext<null | {
  logo: string;
  selectOptions: Pick<
    SelectPlayer,
    'id' | 'firstName' | 'lastName' | 'primary'
  >[];
  menuItems: NavLinkProps[];
}>(null);

function useNavbarContext() {
  const context = useContext(NavbarContext);
  if (!context)
    throw new Error('Navbar components must be used in root component');
  return context;
}

export default function Navbar({
  children,
  logo,
  selectOptions,
  menuItems,
}: NavbarProps) {
  return (
    <>
      <NavbarContext.Provider value={{ logo, selectOptions, menuItems }}>
        <header className="bg-card border-b p-4 flex flex-row gap-4 items-center">
          {children}
        </header>
      </NavbarContext.Provider>
    </>
  );
}

Navbar.Logo = function NavbarLogo() {
  const { logo } = useNavbarContext();
  return <h1 className="text-2xl font-bold">{logo}</h1>;
};

Navbar.Select = function NavbarSelect() {
  const { selectOptions } = useNavbarContext();
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a player" />
      </SelectTrigger>
      <SelectContent>
        {selectOptions.map(({ id, firstName, lastName, primary }) => (
          <SelectItem
            key={id}
            value={id}>
            <div className="flex flex-row gap-4">
              <p>
                {firstName} {lastName}
              </p>
              {primary ? <Badge variant="outline">Primary</Badge> : ''}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
Navbar.Menu = function NavbarMenu() {
  const { menuItems } = useNavbarContext();
  return (
    <menu className="flex flex-row gap-2">
      {menuItems.map((option) => (
        <NavLink
          key={option.to}
          {...option}
        />
      ))}
    </menu>
  );
};
