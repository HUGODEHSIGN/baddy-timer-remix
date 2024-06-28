import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useParams } from '@remix-run/react';
import { $params, $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { zInsertUser } from '~/db/schemas/user';
import { authenticator } from '~/services/auth.server';

const schema = zInsertUser;

export async function action({ request, params }: ActionFunctionArgs) {
  const { locationId } = $params('/signup/:locationId/:name', params);
  invariant(locationId, 'locationId must be defined');

  const formData = await request.clone().formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') return submission.reply();

  return await authenticator.authenticate('user', request, {
    successRedirect: $path('/loggedIn'),
  });
}

export default function Page() {
  const params = useParams();
  const { locationId, name } = $params('/signup/:locationId/:name', params);

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
      <input
        type="hidden"
        name="locationId"
        value={locationId}
        readOnly
      />
      <input
        type="hidden"
        name="name"
        value={name}
        readOnly
      />
      <Label htmlFor={fields.phone.id}>Phone (optional)</Label>
      <Input {...getInputProps(fields.phone, { type: 'text' })} />
      <p className="text-sm font-medium text-destructive">
        {fields.phone.errors}
      </p>
      <Button>Submit</Button>
    </Form>
  );
}
