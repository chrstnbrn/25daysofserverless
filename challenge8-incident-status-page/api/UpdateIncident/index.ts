import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { Incident } from './../Shared/incident';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
  inputDocument: Incident
): Promise<void> {
  if (req.body) {
    const updatedIncident: Incident = {
      ...inputDocument,
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      lastModifiedDate: new Date().toISOString()
    };

    context.bindings.outputDocument = updatedIncident;

    context.res = {
      status: 204
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass an incident in the request body"
    };
  }
};

export default httpTrigger;
