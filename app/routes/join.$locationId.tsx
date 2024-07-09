import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { useEffect } from 'react';
import { $params, $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { db } from '~/db/drizzle.server';
import { locationTable } from '~/db/schemas/location.server';
import { userTable } from '~/db/schemas/user.server';
import useToast from '~/hooks/useToast';
import validateRequest from '~/services/auth/validateRequest.server';
import { ToastData, ToastType } from '~/services/toast';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { session } = await validateRequest(request);
  if (!session) throw redirect($path('/login'));

  const { locationId } = $params('/join/:locationId', params);

  const result = await db
    .select()
    .from(locationTable)
    .where(eq(locationTable.id, locationId));
  if (!result.length) throw redirect($path('/join'));

  return result[0];
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { user } = await validateRequest(request);
  invariant(user, 'Unauthorized');
  const { locationId } = $params('/join/:locationId', params);

  try {
    await db
      .update(userTable)
      .set({ playerLocationId: locationId })
      .where(eq(userTable.id, user?.id));
    return { type: 'success', message: 'Successfully joined location' };
  } catch (error) {
    console.error(error);
    let message;
    if (error instanceof Error) message = error.message;
    return { type: 'error', message };
  }
}

export default function JoinLocationsPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { name } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === 'submitting';

  const toastData = new ToastData(
    'join-location',
    actionData?.type as ToastType,
    actionData?.message
  );
  if (isSubmitting) toastData.setType('loading').setMessage('Joining...');

  useToast(toastData);

  useEffect(() => {
    if (!isSubmitting && actionData?.type === 'success')
      navigate($path('/dashboard'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <>
      <p>Join {name}</p>
      <Form method="post">
        <Button type="submit">Join</Button>
      </Form>
    </>
  );
}
