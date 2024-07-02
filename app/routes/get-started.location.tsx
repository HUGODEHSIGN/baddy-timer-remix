import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import { db } from '~/db/drizzle.server';
import { playerTable } from '~/db/schemas/player.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user } = await validateRequest(request);

  if (!user) throw redirect($path('/login'));

  const primaryPlayer = await db
    .select({
      firstName: playerTable.firstName,
      lastName: playerTable.lastName,
    })
    .from(playerTable);

  if (primaryPlayer.length === 0) throw redirect($path('/login'));

  const { firstName, lastName } = primaryPlayer[0];

  return { session, user, firstName, lastName };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  console.log(intent);
  if (intent === 'skip') return redirect($path('/dashboard'));
}

export default function GetStartedLocationPage() {
  const { firstName, lastName } = useLoaderData<typeof loader>();
  return (
    <div>
      {firstName}
      {lastName}
      <Form method="post">
        <Button
          type="submit"
          name="intent"
          value="skip">
          Skip
        </Button>
      </Form>
    </div>
  );
}
