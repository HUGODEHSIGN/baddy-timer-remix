import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import useMediaQuery from '~/hooks/useMediaQuery';

import { useNavigate } from '@remix-run/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { $path } from 'remix-routes';
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
  closeButton?: string;
};

export default function ResponsiveDialog({
  children,
  title,
  description,
  closeButton = 'Cancel',
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
      <Dialog
        key="1"
        open={open}
        onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div>{children}</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{closeButton}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      key="2"
      open={open}
      onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{children}</div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{closeButton}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
