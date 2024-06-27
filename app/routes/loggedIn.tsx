import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { authenticator } from '~/services/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  return user;
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: '/login' });
}

export default function Page() {
  const user = useLoaderData<typeof loader>();
  return (
    <div>
      <p>{user.user_session}</p>
      <Form method="post">
        <Button type="submit">logout</Button>
      </Form>
    </div>
  );
}
