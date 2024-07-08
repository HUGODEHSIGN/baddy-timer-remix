import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { generateIdFromEntropySize } from 'lucia';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { db } from '~/db/drizzle.server';
import { adminTable, InsertAdmin } from '~/db/schemas/admin.server';
import { InsertLocation, locationTable } from '~/db/schemas/location.server';
import useToast from '~/hooks/useToast';
import { ToastData, ToastType } from '~/services/auth/toast';
import validateRequest from '~/services/auth/validateRequest.server';

type Schema = Pick<InsertLocation, 'name'>;

const schema: z.ZodType<Schema> = z.object({
  name: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user } = await validateRequest(request);

  if (!user) throw redirect($path('/login'));

  return { session, user };
}

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

    const insertAdminValues: InsertAdmin = {
      userId: user.id,
      locationId,
      owner: true,
      verified: true,
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
    console.error(error);
    let message;
    if (error instanceof Error) message = error.message;
    return {
      lastResult: submission.reply(),
      toast: { type: 'error', message },
    };
  }
}

export default function GetStartedAdminPage() {
  const navigation = useNavigation();
  const { toast, lastResult } = useActionData<typeof action>() ?? {};
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  const isSubmitting = navigation.state === 'submitting';

  const toastData = new ToastData(
    'admin-init',
    toast?.type as ToastType,
    toast?.message
  );

  if (!form.valid) toastData.setType('error').setMessage('Form invalid');

  if (isSubmitting) toastData.setType('loading').setMessage('Adding player...');

  useToast(toastData);

  const redirect = !isSubmitting && toast?.type === 'success';

  return (
    <>
      <Form
        method="post"
        {...getFormProps(form)}>
        <div>
          <Label htmlFor={fields.name.id}>Location Name</Label>
          <Input
            {...getInputProps(fields.name, { type: 'text' })}
            disabled={isSubmitting}
          />
          {fields.name.errors ? (
            <p className="text-red-500">{fields.name.errors}</p>
          ) : (
            <p className="invisible">placeholder</p>
          )}
        </div>
        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
}
