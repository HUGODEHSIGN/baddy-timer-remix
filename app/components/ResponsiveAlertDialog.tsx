import useMediaQuery from '~/hooks/useMediaQuery';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';

import { useNavigate } from '@remix-run/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { $path } from 'remix-routes';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer';

type ResponsiveDialogProps = PropsWithChildren & {
  title: string;
  description: string;
};

export default function ResponsiveAlertDialog({
  children,
  title,
  description,
}: ResponsiveDialogProps) {
  const [open, setOpen] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(
        () => navigate($path('/dashboard/players')),
        260
      );
      return () => clearTimeout(timeout);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (isDesktop) {
    return (
      <AlertDialog
        open={open}
        onOpenChange={setOpen}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          {children}
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        {children}
      </DrawerContent>
    </Drawer>
  );
}
