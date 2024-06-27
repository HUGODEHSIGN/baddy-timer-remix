import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { authenticator } from '~/services/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('user-pass', request, {
    successRedirect: '/loggedIn',
    failureRedirect: '/login',
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/loggedIn',
  });
}

export default function Page() {
  return (
    <Form method="post">
      <Input
        name="username"
        type="text"
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
