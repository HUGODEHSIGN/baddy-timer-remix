import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import { action } from '~/routes/api.deleteUser';
import validateRequest from '~/services/auth/validateRequest.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, headers } = await validateRequest(request);

  return json(
    { session, user },
    {
      headers,
    }
  );
}

export default function LoggedInPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log(actionData);
  return (
    <>
      <div>{data.user?.username}</div>
      <Form
        action={$path('/api/logout')}
        method="post">
        <Button type="submit">Sign Out</Button>
      </Form>
      <Form
        action={$path('/api/deleteUser')}
        method="post">
        <Button
          type="submit"
          variant="destructive">
          Delete User
        </Button>
      </Form>
    </>
  );
}
