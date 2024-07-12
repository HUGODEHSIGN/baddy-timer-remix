import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { db } from '~/db/drizzle.server';
import { adminTable } from '~/db/schemas/admin.server';
import { locationTable, SelectLocation } from '~/db/schemas/location.server';
import validateRequest from '~/services/auth/validateRequest.server';

export default async function getLocations(request: Request) {
  const { user } = await validateRequest(request);
  invariant(user, 'Unauthorized');

  const locations = await db
    .select({ location: locationTable })
    .from(adminTable)
    .where(eq(adminTable.userId, user.id))
    .leftJoin(locationTable, eq(adminTable.locationId, locationTable.id));

  if (!locations.length) {
    return [] as SelectLocation[];
  }

  return locations.map(({ location }) => {
    invariant(location, 'Location not found');
    return {
      id: location.id,
      name: location.name,
    };
  });
}
