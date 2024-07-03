import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import useMediaQuery from '~/hooks/useMediaQuery';

import { FormMetadata } from '@conform-to/react';
import { useNavigate } from '@remix-run/react';
import { PropsWithChildren, useEffect, useState } from 'react';
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
  closeButton?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: FormMetadata<any>;
  path?: string;
  redirect?: boolean;
};

/**
 * Cancel needs to included externally and set to type='button'
 */
export default function ResponsiveDialog({
  children,
  title,
  description,
  path,
  redirect = false,
}: ResponsiveDialogProps) {
  const [open, setOpen] = useState(true);
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

  if (!isDesktop)
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}
        shouldScaleBackground>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 mb-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
