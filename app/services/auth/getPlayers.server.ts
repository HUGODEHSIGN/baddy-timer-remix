import { and, eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { db } from '~/db/drizzle.server';
import { playerTable } from '~/db/schemas/player.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function getPlayers(request: Request) {
  const { user } = await validateRequest(request);

  invariant(user, 'Unauthorized');

  const players = await db
    .select({
      id: playerTable.id,
      firstName: playerTable.firstName,
      lastName: playerTable.lastName,
      primary: playerTable.primary,
    })
    .from(playerTable)
    .where(eq(playerTable.userId, user.id));

  return { players };
}

export async function getPrimaryPlayer(request: Request) {
  const { user } = await validateRequest(request);

  invariant(user, 'Unauthorized');

  const players = await db
    .select({
      id: playerTable.id,
      firstName: playerTable.firstName,
      lastName: playerTable.lastName,
      primary: playerTable.primary,
    })
    .from(playerTable)
    .where(and(eq(playerTable.userId, user.id), eq(playerTable.primary, true)));

  const primaryPlayer = players[0];

  if (!primaryPlayer) return { primaryPlayer: null };

  return { primaryPlayer };
}
