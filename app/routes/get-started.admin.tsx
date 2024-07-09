import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { useEffect } from 'react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { db } from '~/db/drizzle.server';
import { userTable } from '~/db/schemas/user.server';
import useToast from '~/hooks/useToast';
import validateRequest from '~/services/auth/validateRequest.server';
import { ToastData, ToastType } from '~/services/toast';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user } = await validateRequest(request);
  if (!session || !user) throw redirect('/login');
  if (user.admin) throw redirect($path('/dashboard/admin'));
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { user } = await validateRequest(request);

  try {
    invariant(user, 'Unauthorized');

    await db
      .update(userTable)
      .set({ admin: true })
      .where(eq(userTable.id, user.id));

    return {
      type: 'success',
      message: 'Congradulations, you are now an admin',
    };
  } catch (error) {
    console.error(error);
    let message;
    if (error instanceof Error) message = error.message;
    return {
      type: 'error',
      message,
    };
  }
}

export default function GetStartedAdminPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  const toastData = new ToastData(
    'init-admin',
    actionData?.type as ToastType,
    actionData?.message
  );
  const isSubmitting = navigation.state === 'submitting';

  if (isSubmitting) toastData.setType('loading').setMessage('Loading...');

  useToast(toastData);

  useEffect(() => {
    if (!isSubmitting && actionData?.type === 'success')
      navigate($path('/dashboard/admin'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <>
      <h2>Are you sure?</h2>
      <Form method="post">
        <Button type="submit">Continue</Button>
      </Form>
    </>
  );
}
