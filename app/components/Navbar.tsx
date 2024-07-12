import { Link } from '@remix-run/react';
import { createContext, PropsWithChildren, useContext } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

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

type SelectOptions = {
  id: string;
  value: string;
  display: string;
};

type NavbarProps = PropsWithChildren & {
  logo: string;
  menuItems: NavLinkProps[];
  selectOptions: SelectOptions[];
  selectValue?: string;
  onValueChange?: (value: string) => void;
};

const NavbarContext = createContext<null | NavbarProps>(null);

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
  selectValue,
  onValueChange,
}: NavbarProps) {
  return (
    <>
      <NavbarContext.Provider
        value={{ logo, selectOptions, menuItems, selectValue, onValueChange }}>
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
  const { selectOptions, selectValue, onValueChange } = useNavbarContext();

  return (
    <Select
      value={selectValue}
      onValueChange={onValueChange}
      name="navbar-select">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a player" />
      </SelectTrigger>
      <SelectContent>
        {selectOptions.map(({ id, value, display }) => (
          <SelectItem
            key={id}
            value={value}>
            <div className="flex flex-row gap-4">
              <p>{display}</p>
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
