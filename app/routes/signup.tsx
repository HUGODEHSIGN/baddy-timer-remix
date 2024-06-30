import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import bcrypt from 'bcrypt';
import { generateIdFromEntropySize } from 'lucia';
import { $path } from 'remix-routes';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { db } from '~/db/drizzle.server';
import { lucia } from '~/db/lucia.server';
import { InsertUser, user } from '~/db/schemas/user.server';

import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { Label } from '~/components/ui/label';

type Schema = Pick<InsertUser, 'username'> & {
  password: string;
  confirmPassword: string;
};

const schema: z.ZodType<Schema> = z
  .object({
    username: z.string().min(3).max(15),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password is too long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*?]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') return submission.reply();

  const userId = generateIdFromEntropySize(10);

  const passwordHash = await bcrypt.hash(submission.value.password, 12);

  const insertValues: InsertUser = {
    id: userId,
    username: submission.value.username,
    passwordHash,
  };

  await db.insert(user).values(insertValues);

  const session = await lucia.createSession(userId, {});
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
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
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
      <Input {...getInputProps(fields.password, { type: 'text' })} />
      <p className="text-red-500">{fields.password.errors}</p>

      <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
      <Input {...getInputProps(fields.confirmPassword, { type: 'text' })} />
      <p className="text-red-500">{fields.confirmPassword.errors}</p>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
