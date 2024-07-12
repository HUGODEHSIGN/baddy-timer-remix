import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { $params, $path } from 'remix-routes';
import ResponsiveAlertDialog from '~/components/ResponsiveAlertDialog';
import { Button } from '~/components/ui/button';

import { db } from '~/db/drizzle.server';
import { courtTable } from '~/db/schemas/court.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const { courtId } = $params(
    '/dashboard/admin/courts/delete/:courtId',
    params
  );
  const court = await db
    .select()
    .from(courtTable)
    .where(eq(courtTable.id, courtId));

  if (court.length === 0) throw redirect($path('/dashboard/admin/courts'));
  return court[0];
}

export async function action({ params }: ActionFunctionArgs) {
  const { courtId } = $params(
    '/dashboard/admin/courts/delete/:courtId',
    params
  );
  try {
    const result = await db
      .delete(courtTable)
      .where(eq(courtTable.id, courtId))
      .returning({
        name: courtTable.name,
      });
    const { name } = result[0];
    return {
      type: 'success',
      message: `${name} deleted`,
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

export default function AdminDeleteCourtPage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const court = useLoaderData<typeof loader>();

  const isSubmitting = navigation.state === 'submitting';

  const redirect = !isSubmitting && actionData?.type === 'success';

  return (
    <ResponsiveAlertDialog
      title={`Are you sure you want to delete ${court.name}`}
      description="This action cannot be undone"
      path={$path('/dashboard/admin/courts')}
      redirect={redirect}>
      <Form
        method="post"
        className="w-full md:w-auto">
        <Button
          variant="destructive"
          type="submit"
          className="w-full md:w-auto">
          Delete
        </Button>
      </Form>
    </ResponsiveAlertDialog>
  );
}
