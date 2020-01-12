import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as querystring from 'querystring';
import * as uuidv4 from 'uuid/v4';

import { Wish } from '../Shared/wish';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const wish = getWish(req);

  if (wish) {
    const wishId = uuidv4();

    context.bindings.outputDocument = {
      ...wish,
      id: wishId
    };

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

function getWish(req: HttpRequest): Wish {
  if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
    return (querystring.parse(req.body) as unknown) as Wish;
  } else {
    return req.body as Wish;
  }
}

export default httpTrigger;
