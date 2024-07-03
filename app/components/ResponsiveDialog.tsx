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
import { toast } from 'sonner';
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
};

/**
 * Cancel needs to included externally and set to type='button'
 */
export default function ResponsiveDialog({
  children,
  title,
  description,
  form,
  path,
}: ResponsiveDialogProps) {
  const [open, setOpen] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleToast(form: FormMetadata<any>) {
      if (form.status === 'error' && !form.valid)
        return toast.error('Please fill out the form entirely', {
          id: form.id,
        });

      if (form.status === 'error' && form.errors)
        return toast.error(form.errors[0], { id: form.id });

      if (form.status === 'error')
        return toast.error('Something went wrong', { id: form.id });

      setOpen(false);
      toast.success('Player Added', { id: form.id });
    }

    if (!form || !form.status) return;
    handleToast(form);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.status]);

  useEffect(() => {
    function handleRedirect(path: string) {
      const timeout = setTimeout(() => navigate(path), 260);
      return () => clearTimeout(timeout);
    }
    if (!path || open) return;
    return handleRedirect(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!isDesktop)
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{children}</div>
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
