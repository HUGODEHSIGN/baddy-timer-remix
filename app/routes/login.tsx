import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { generateIdFromEntropySize } from 'lucia';
import { $path } from 'remix-routes';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { db } from '~/db/drizzle.server';
import { lucia } from '~/db/lucia.server';
import { InsertUser, user } from '~/db/schemas/user.server';

type Schema = Pick<InsertUser, 'username'> & {
  password: string;
};

const schema: z.ZodType<Schema> = z.object({
  username: z.string().min(3).max(15),
  password: z.string().min(8).max(64),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') return submission.reply();

  const userId = generateIdFromEntropySize(10);

  const insertValues: InsertUser = {
    id: userId,
    username: submission.value.username,
    passwordHash: submission.value.password,
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
  return (
    <Form method="post">
      <Input
        type="text "
        name="username"
        placeholder="Username"
      />
      <Input
        type="text "
        name="password"
        placeholder="Password"
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
