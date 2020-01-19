import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { Message } from './../Shared/message';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const message = req.body as Message;

  context.bindings.signalRMessages = [
    {
      target: "newMessage",
      arguments: [message]
    }
  ];
};

export default httpTrigger;
