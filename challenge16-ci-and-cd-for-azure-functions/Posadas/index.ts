import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import posadas from '../posadas.json';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.res.body = posadas;
};

export default httpTrigger;
