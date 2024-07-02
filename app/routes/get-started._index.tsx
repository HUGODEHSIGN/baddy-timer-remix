import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { generateIdFromEntropySize } from 'lucia';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { db } from '~/db/drizzle.server';
import { InsertPlayer, playerTable } from '~/db/schemas/player.server';
import validateRequest from '~/services/auth/validateRequest.server';

type Schema = Pick<InsertPlayer, 'firstName' | 'lastName'>;

const schema: z.ZodType<Schema> = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, headers } = await validateRequest(request);

  if (!user) throw redirect($path('/login'));

  return json({ session, user }, { headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') return submission.reply();

  const { user } = await validateRequest(request);

  invariant(user, 'Unauthorized');

  const id = generateIdFromEntropySize(10);

  const insertValues: InsertPlayer = {
    id,
    firstName: submission.value.firstName,
    lastName: submission.value.lastName,
    primary: true,
    userId: user.id,
  };

  await db.insert(playerTable).values(insertValues);

  return redirect($path('/get-started/location'));
}

export default function GetStartedPage() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <>
      <Form
        method="post"
        {...getFormProps(form)}>
        <Label htmlFor={fields.firstName.id}>First Name</Label>
        <Input {...getInputProps(fields.firstName, { type: 'text' })} />
        <p className="text-red-500">{fields.firstName.errors}</p>

        <Label htmlFor={fields.lastName.id}>Last Name</Label>
        <Input {...getInputProps(fields.lastName, { type: 'text' })} />
        <p className="text-red-500">{fields.lastName.errors}</p>

        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
}
