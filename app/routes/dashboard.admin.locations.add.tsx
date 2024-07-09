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
import { adminTable } from '~/db/schemas/admin.server';
import { InsertLocation, locationTable } from '~/db/schemas/location.server';
import useToast from '~/hooks/useToast';
import validateRequest from '~/services/auth/validateRequest.server';
import { ToastData, ToastType } from '~/services/toast';

type Schema = Pick<InsertLocation, 'name'>;

const schema: z.ZodType<Schema> = z.object({
  name: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  try {
    const { user } = await validateRequest(request);
    invariant(user, 'Unauthorized');

    if (submission.status !== 'success') throw new Error('Form invalid');

    const locationId = generateIdFromEntropySize(10);

    const insertLocationValues: InsertLocation = {
      id: locationId,
      name: submission.value.name,
    };

    const insertAdminValues = {
      userId: user.id,
      locationId,
    };

    await db.transaction(async (tx) => {
      await tx.insert(locationTable).values(insertLocationValues);
      await tx.insert(adminTable).values(insertAdminValues);
    });

    return {
      lastResult: submission.reply(),
      toast: { type: 'success', message: 'Successfully added location' },
    };
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    return {
      lastResult: submission.reply(),
      toast: { type: 'error', message },
    };
  }
}

export default function AdminAddLocationsPage() {
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
    'add-location',
    toast?.type as ToastType,
    toast?.message
  );

  if (!form.valid) toastData.setType('error').setMessage('Form invalid');

  if (isSubmitting)
    toastData.setType('loading').setMessage('Adding location...');

  useToast(toastData);

  const redirect = !isSubmitting && toast?.type === 'success';

  return (
    <>
      <ResponsiveDialog
        title="Add a Location"
        description="Create a new location"
        form={form}
        path={$path('/dashboard/admin/locations')}
        redirect={redirect}>
        <Form
          method="post"
          {...getFormProps(form)}>
          <Label htmlFor={fields.name.id}>Location Name</Label>
          <Input {...getInputProps(fields.name, { type: 'text' })} />
          {fields.name.errors ? (
            <p className="text-red-500">{fields.name.errors}</p>
          ) : (
            <p className="invisible">placeholder</p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}>
            Add
          </Button>
          <DialogClose asChild>
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
        </Form>
      </ResponsiveDialog>
    </>
  );
}
