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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { db } from '~/db/drizzle.server';
import { courtTable, InsertCourt } from '~/db/schemas/court.server';
import useToast from '~/hooks/useToast';
import validateRequest from '~/services/auth/validateRequest.server';
import { getAdminPrefs } from '~/services/prefs/adminPrefs';
import { ToastData, ToastType } from '~/services/toast';

type Schema = Pick<InsertCourt, 'name'>;

const schema: z.ZodType<Schema> = z.object({
  name: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  const { user } = await validateRequest(request);
  invariant(user, 'Unauthorized');

  const adminPrefs = await getAdminPrefs(request);
  const { locationId } = adminPrefs;

  try {
    if (submission.status !== 'success') throw new Error('Form invalid');

    const courtId = generateIdFromEntropySize(10);

    const insertCourtValues: InsertCourt = {
      id: courtId,
      name: submission.value.name,
      locationId,
    };

    await db.insert(courtTable).values(insertCourtValues);

    return {
      lastResult: submission.reply(),
      toast: { type: 'success', message: 'Successfully added court' },
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

export default function AdminAddCourtsPage() {
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

  if (isSubmitting) toastData.setType('loading').setMessage('Adding court...');

  useToast(toastData);

  const redirect = !isSubmitting && toast?.type === 'success';

  return (
    <>
      <ResponsiveDialog
        title="Add Court"
        description="Add a court to this location"
        form={form}
        path={$path('/dashboard/admin/courts')}
        redirect={redirect}>
        <Form
          method="post"
          {...getFormProps(form)}>
          <Label htmlFor={fields.name.id}>Court Name</Label>
          <Input {...getInputProps(fields.name, { type: 'text' })} />
          {fields.name.errors ? (
            <p className="text-red-500">{fields.name.errors}</p>
          ) : (
            <p className="invisible">placeholder</p>
          )}
          <Button type="submit">Add</Button>
        </Form>
      </ResponsiveDialog>
    </>
  );
}
