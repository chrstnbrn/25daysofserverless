import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { Wish } from '../Shared/wish';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
  wishes: Wish[]
): Promise<void> {
  context.res.body = wishes;
};

export default httpTrigger;
