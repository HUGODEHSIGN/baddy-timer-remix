import { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import ResponsiveAlertDialog from '~/components/ResponsiveAlertDialog';
import { Button } from '~/components/ui/button';
import { db } from '~/db/drizzle.server';
import { playerTable } from '~/db/schemas/player.server';
import { serializeNotification } from '~/services/auth/notifications';

export async function action({ params }: ActionFunctionArgs) {
  const { playerId } = params;

  try {
    invariant(playerId, 'Unauthorized');

    const result = await db
      .delete(playerTable)
      .where(eq(playerTable.id, playerId))
      .returning({
        firstName: playerTable.firstName,
        lastName: playerTable.lastName,
      });

    const deletedPlayer = result[0];

    return redirect($path('/dashboard/players'), {
      headers: {
        'Set-Cookie': await serializeNotification({
          type: 'success',
          message: `${deletedPlayer.firstName} ${deletedPlayer.lastName} deleted`,
        }),
      },
    });
  } catch (error) {
    console.error(error);
    return redirect($path('/dashboard/players'), {
      headers: {
        'Set-Cookie': await serializeNotification({
          type: 'error',
          message: 'Unable to delete player',
        }),
      },
    });
  }
}

export default function DeletePlayerPage() {
  return (
    <ResponsiveAlertDialog
      title="Are you sure you want to delete this player?"
      description="This action cannot be undone">
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
