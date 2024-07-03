import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { generateIdFromEntropySize } from 'lucia';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import ResponsiveDialog from '~/components/ResponsiveDialog';
import { Button } from '~/components/ui/button';
import { DialogClose } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { db } from '~/db/drizzle.server';
import { InsertPlayer, playerTable } from '~/db/schemas/player.server';
import useToast from '~/hooks/useToast';
import { ToastData, ToastType } from '~/services/auth/toast';
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
    return {
      lastResult: submission.reply(),
      toast: { type: 'success', message: 'Successfully added player' },
    };
  } catch (error) {
    console.error(error);
    let message;
    if (error instanceof Error) message = error.message;
    return {
      lastResult: submission.reply(),
      toast: { type: 'error', message },
    };
  }
}

export default function AddPlayerPage() {
  const navigation = useNavigation();

  const actionData = useActionData<typeof action>();

  const { lastResult, toast } = actionData ?? {};

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  const isSubmitting = navigation.state === 'submitting';

  const toastData = new ToastData(
    'add-player',
    toast?.type as ToastType,
    toast?.message
  );

  if (!form.valid)
    toastData.setType('error').setMessage('Please fill out the form entirely');

  if (isSubmitting) toastData.setType('loading').setMessage('Adding player...');

  useToast(toastData);

  const redirect = !isSubmitting && toast?.type === 'success';

  return (
    <ResponsiveDialog
      title="Add a Player"
      description="Create a new player"
      form={form}
      path={$path('/dashboard/players')}
      redirect={redirect}>
      <Form
        method="post"
        {...getFormProps(form)}
        className="flex flex-col gap-1">
        <div>
          <Label htmlFor={fields.firstName.id}>First Name</Label>
          <Input
            {...getInputProps(fields.firstName, { type: 'text' })}
            disabled={isSubmitting}
          />
          {fields.firstName.errors ? (
            <p className="text-red-500">{fields.firstName.errors}</p>
          ) : (
            <p className="invisible">placeholder</p>
          )}
        </div>
        <div>
          <Label htmlFor={fields.lastName.id}>Last Name</Label>
          <Input
            {...getInputProps(fields.lastName, { type: 'text' })}
            disabled={isSubmitting}
          />
          {fields.lastName.errors ? (
            <p className="text-red-500">{fields.lastName.errors}</p>
          ) : (
            <p className="invisible">placeholder</p>
          )}
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
