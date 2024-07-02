import useMediaQuery from '~/hooks/useMediaQuery';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

import { useNavigate } from '@remix-run/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer';

type ResponsiveDialogProps = PropsWithChildren & {
  title: string;
  description: string;
  cancelButton?: string;
};

/**
 * Cancel button is included in this component due to DialogClose issues
 */
export default function ResponsiveAlertDialog({
  children,
  title,
  description,
  cancelButton = 'cancel',
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                type="button">
                {cancelButton}
              </Button>
            </AlertDialogCancel>
            {children}
          </AlertDialogFooter>
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
        <DrawerFooter>
          {children}
          <DrawerClose asChild>
            <Button
              variant="outline"
              type="button">
              {cancelButton}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
