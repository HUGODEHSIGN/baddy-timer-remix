import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { $path } from 'remix-routes';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { adminAuthenticator } from '~/services/admin/adminAuth.server';

const schema = z
  .object({
    firstName: z
      .string({ required_error: 'First Name is required' })
      .min(2, 'First name is too short')
      .max(20, 'First name is too long'),
    lastName: z
      .string({ required_error: 'Last Name is required' })
      .min(2, 'Last name is too short')
      .max(20, 'Last name is too long'),
    password: z
      .string()
      .min(8, 'Password is too short')
      .max(128, 'Password is too long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(
        /[!@#$%^&*?]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') return submission.reply();

  return await adminAuthenticator.authenticate('admin', request, {
    successRedirect: $path('/admin/dashboard'),
  });
}

export default function Page() {
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
      <Label htmlFor={fields.firstName.id}>First Name</Label>
      <Input {...getInputProps(fields.firstName, { type: 'text' })} />
      <p className="text-sm font-medium text-destructive">
        {fields.firstName.errors}
      </p>

      <Label htmlFor={fields.lastName.id}>Last Name</Label>
      <Input {...getInputProps(fields.lastName, { type: 'text' })} />
      <p className="text-sm font-medium text-destructive">
        {fields.lastName.errors}
      </p>

      <Label htmlFor={fields.password.id}>Password</Label>
      <Input {...getInputProps(fields.password, { type: 'text' })} />
      <p className="text-sm font-medium text-destructive">
        {fields.password.errors}
      </p>

      <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
      <Input {...getInputProps(fields.confirmPassword, { type: 'text' })} />
      <p className="text-sm font-medium text-destructive">
        {fields.confirmPassword.errors}
      </p>
      <Button type="submit">Sign Up</Button>
    </Form>
  );
}
