import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export default function Page() {
  return (
    <Form method="post">
      <Button type="submit">Logout</Button>
    </Form>
  );
}
