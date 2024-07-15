import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import { getPrimaryPlayer } from '~/services/auth/getPlayers.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { primaryPlayer } = await getPrimaryPlayer(request);

  if (!primaryPlayer) throw redirect($path('/get-started'));

  return primaryPlayer;
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
