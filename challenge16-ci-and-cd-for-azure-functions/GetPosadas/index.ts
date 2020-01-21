import { Context } from '@azure/functions';

import posadas from '../posadas.json';

export default async function(context: Context, req: any): Promise<void> {
  context.res.body = posadas;
}
