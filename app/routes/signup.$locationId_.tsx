import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { $params, $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const schema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name is too short')
    .max(20, 'Name is too long'),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const { locationId } = $params('/signup/:locationId', params);
  invariant(locationId, 'locationId must be defined');

  const formData = await request.formData();
  invariant(formData, 'formData must be defined');

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') return submission.reply();

  return redirect(
    $path('/signup/:locationId/:name', {
      locationId,
      name: submission.value.name,
    })
  );
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
      <Label htmlFor={fields.name.id}>Name</Label>
      <Input {...getInputProps(fields.name, { type: 'text' })} />
      <p className="text-sm font-medium text-destructive">
        {fields.name.errors}
      </p>
      <Button type="submit">Next</Button>
    </Form>
  );
}
