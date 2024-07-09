import { useEffect } from 'react';
import { toast } from 'sonner';
import { ToastData } from '~/services/toast';

export default function useToast(toastData: ToastData) {
  const { id, type, message } = toastData;
  useEffect(() => {
    function handleToast() {
      if (!type || !message) return toast.dismiss(id);

      const toastLookup = {
        success: toast.success,
        warning: toast.warning,
        error: toast.error,
        loading: toast.loading,
        default: toast,
      };

      return toastLookup[type](message, { id });
    }

    handleToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, message]);
}
