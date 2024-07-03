import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { Toaster } from '~/components/ui/sonner';
import './tailwind.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        richColors
        position="top-right"
        // need empty options to enable colors
        toastOptions={{}}
      />
      <div
        // eslint-disable-next-line react/no-unknown-property
        vaul-drawer-wrapper=""
        className="bg-white min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
