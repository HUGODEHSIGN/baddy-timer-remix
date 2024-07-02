import { Form } from '@remix-run/react';
import ResponsiveAlertDialog from '~/components/ResponsiveAlertDialog';
import { Button } from '~/components/ui/button';

export default function DeletePlayerPage() {
  return (
    <ResponsiveAlertDialog
      title="Are you sure you want to delete this player?"
      description="This action cannot be undone">
      <Form
        method="post"
        className="*:w-full">
        <Button variant="destructive">Delete</Button>
      </Form>
    </ResponsiveAlertDialog>
  );
}
