import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData } from '@remix-run/react';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { db } from '~/db/drizzle.server';
import { lucia } from '~/db/lucia.server';
import { InsertUser, userTable } from '~/db/schemas/user.server';

type Schema = Pick<InsertUser, 'username'> & {
  password: string;
};

const schemaClient: z.ZodType<Schema> = z.object({
  username: z.string(),
  password: z.string(),
});

const schemaServer: z.ZodType<Schema> = schemaClient.refine(
  async ({ username, password }) => {
    const existingUser = await db
      .select({ passwordHash: userTable.passwordHash })
      .from(userTable)
      .where(eq(userTable.username, username));

    if (existingUser.length === 0) return false;

    return bcrypt.compare(password, existingUser[0].passwordHash);
  },
  { message: 'Incorrect username or password', path: ['password'] }
);

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: schemaServer,
    async: true,
  });

  if (submission.status !== 'success') return submission.reply();

  const username = submission.value.username;
  const existingUser = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.username, username));

  const session = await lucia.createSession(existingUser[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return redirect($path('/loggedIn'), {
    headers: {
      'Set-Cookie': sessionCookie.serialize(),
    },
  });
}

export default function LoginPage() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schemaClient),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schemaClient });
    },
  });

  return (
    <Form
      method="post"
      {...getFormProps(form)}>
      <Label htmlFor={fields.username.id}>Username</Label>
      <Input {...getInputProps(fields.username, { type: 'text' })} />
      <p className="text-red-500">{fields.username.errors}</p>
      <Label htmlFor={fields.password.id}>Password</Label>
      <Input {...getInputProps(fields.password, { type: 'password' })} />
      <p className="text-red-500">{fields.password.errors}</p>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
