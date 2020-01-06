import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as uuidv4 from 'uuid/v4';

import { Incident } from './../Shared/incident';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (req.body) {
    const incidentId = uuidv4();
    const nowString = new Date().toISOString();

    const incident: Incident = {
      ...req.body,
      id: incidentId,
      createdDate: nowString,
      lastModifiedDate: nowString
    };

    context.bindings.outputDocument = incident;

    context.bindings.signalRMessages = [
      {
        target: "newIncident",
        arguments: [incident]
      }
    ];

    context.res = {
      status: 201,
      body: incidentId
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass an incident in the request body"
    };
  }
};

export default httpTrigger;
