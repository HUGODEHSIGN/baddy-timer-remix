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
  path?: string;
  redirect?: boolean;
};

/**
 * Cancel button is included in this component due to DialogClose issues
 *
 * Include path and redirect if you want to redirect upon closing
 * Redirects to path when redirect prop is true
 */
export default function ResponsiveAlertDialog({
  children,
  title,
  description,
  cancelButton = 'cancel',
  path,
  redirect = false,
}: ResponsiveDialogProps) {
  const [open, setOpen] = useState(!redirect);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    if (open || !path) return;
    const timeout = setTimeout(() => navigate(path), 260);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!redirect) return;
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect]);

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
