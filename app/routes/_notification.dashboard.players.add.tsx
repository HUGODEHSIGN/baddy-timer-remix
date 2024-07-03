import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { generateIdFromEntropySize } from 'lucia';
import { useEffect } from 'react';
import { $path } from 'remix-routes';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import ResponsiveDialog from '~/components/ResponsiveDialog';
import { Button } from '~/components/ui/button';
import { DialogClose } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { db } from '~/db/drizzle.server';
import { InsertPlayer, playerTable } from '~/db/schemas/player.server';
import validateRequest from '~/services/auth/validateRequest.server';

type Schema = Pick<InsertPlayer, 'firstName' | 'lastName'>;

const schema: z.ZodType<Schema> = z.object({
  firstName: z
    .string()
    .min(2, 'First name is too short')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(2, 'Last name is too short')
    .max(30, 'Last name is too long'),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema,
  });

  try {
    if (submission.status !== 'success')
      throw new Error('Please fill out the form entirely');
    const { user } = await validateRequest(request);

    invariant(user, 'Unauthorized');

    const insertValues: InsertPlayer = {
      id: generateIdFromEntropySize(10),
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      primary: false,
      userId: user.id,
    };
    await db.insert(playerTable).values(insertValues);
    return submission.reply();
  } catch (error) {
    console.error(error);
    let message;
    if (error instanceof Error) message = error.message;
    return submission.reply({
      formErrors: [message as string],
    });
  }
}

export default function AddPlayerPage() {
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (!isSubmitting) return;
    toast.loading('...adding', { id: form.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <ResponsiveDialog
      title="Add a Player"
      description="Create a new player"
      form={form}
      path={$path('/dashboard/players')}>
      <Form
        method="post"
        {...getFormProps(form)}
        className="flex flex-col gap-4">
        <div>
          <Label htmlFor={fields.firstName.id}>First Name</Label>
          <Input
            {...getInputProps(fields.firstName, { type: 'text' })}
            disabled={isSubmitting}
          />
          <p className="text-red-500">{fields.firstName.errors}</p>
        </div>
        <div>
          <Label htmlFor={fields.lastName.id}>Last Name</Label>
          <Input
            {...getInputProps(fields.lastName, { type: 'text' })}
            disabled={isSubmitting}
          />
          <p className="text-red-500">{fields.lastName.errors}</p>
        </div>
        <div className="flex flex-col sm:flex-row-reverse gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}>
            Submit
          </Button>
          <DialogClose asChild>
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
        </div>
      </Form>
    </ResponsiveDialog>
  );
}
