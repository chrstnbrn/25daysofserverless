import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as uuidv4 from 'uuid/v4';

import { Wish } from '../Shared/wish';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (req.body) {
    const wishId = uuidv4();

    const wish: Wish = {
      ...req.body,
      id: wishId
    };

    context.bindings.outputDocument = wish;

    context.res = {
      status: 201,
      body: wishId
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass a wish in the request body"
    };
  }
};

export default httpTrigger;
