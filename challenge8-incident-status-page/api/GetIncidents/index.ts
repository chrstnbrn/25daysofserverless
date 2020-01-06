import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { Incident } from './../Shared/incident';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
  incidents: Incident[]
): Promise<void> {
  context.res.body = incidents;
};

export default httpTrigger;
