import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { useEffect } from 'react';
import { $params, $path } from 'remix-routes';
import ResponsiveAlertDialog from '~/components/ResponsiveAlertDialog';
import { Button } from '~/components/ui/button';
import { db } from '~/db/drizzle.server';
import { playerTable } from '~/db/schemas/player.server';
import useToast from '~/hooks/useToast';
import { ToastData, ToastType } from '~/services/toast';

export async function action({ params }: ActionFunctionArgs) {
  const { playerId } = $params('/dashboard/players/delete/:playerId', params);

  try {
    const result = await db
      .delete(playerTable)
      .where(eq(playerTable.id, playerId))
      .returning({
        firstName: playerTable.firstName,
        lastName: playerTable.lastName,
      });

    const deletedPlayer = result[0];

    return {
      type: 'success',
      message: `${deletedPlayer.firstName} ${deletedPlayer.lastName} deleted`,
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

export default function DeletePlayerPage() {
  const navigation = useNavigation();

  const actionData = useActionData<typeof action>();
  const toastData = new ToastData(
    'delete-player',
    actionData?.type as ToastType,
    actionData?.message
  );
  if (navigation.state === 'submitting')
    toastData.setType('loading').setMessage('Deleting player...');

  const redirect =
    navigation.state !== 'submitting' && actionData?.type === 'success';

  useToast(toastData);

  useEffect(() => {
    console.log(actionData?.type.toString());
  }, [actionData?.type]);

  return (
    <ResponsiveAlertDialog
      title="Are you sure you want to delete this player?"
      description="This action cannot be undone"
      path={$path('/dashboard/players')}
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
