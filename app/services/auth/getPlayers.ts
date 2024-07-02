import { and, eq } from 'drizzle-orm';
import { db } from '~/db/drizzle.server';
import { playerTable } from '~/db/schemas/player.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function getPlayers(request: Request) {
  const { session, user, headers } = await validateRequest(request);

  if (!user || !session)
    return {
      session,
      user,
      headers,
      players: null,
    };

  const players = await db
    .select({
      id: playerTable.id,
      firstName: playerTable.firstName,
      lastName: playerTable.lastName,
      primary: playerTable.primary,
    })
    .from(playerTable)
    .where(eq(playerTable.userId, user.id));

  return { session, user, headers, players };
}

export async function getPrimaryPlayer(request: Request) {
  const { session, user, headers } = await validateRequest(request);

  if (!user || !session) return { session, user, headers, primaryPlayer: null };

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

  if (!primaryPlayer) return { session, user, headers, primaryPlayer: null };

  return { session, user, headers, primaryPlayer };
}
