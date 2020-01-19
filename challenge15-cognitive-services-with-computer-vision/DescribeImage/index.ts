import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const key = process.env["COMPUTER_VISION_SUBSCRIPTION_KEY"];
const endpoint = process.env["COMPUTER_VISION_ENDPOINT"];
const apiKeyCredentials = new ApiKeyCredentials({
  inHeader: { "Ocp-Apim-Subscription-Key": key }
});
const computerVisionClient = new ComputerVisionClient(
  apiKeyCredentials,
  endpoint
);

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const result = await computerVisionClient.describeImageInStream(req.body);
    context.res = {
      body: {
        captions: result.captions,
        tags: result.tags
      }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error?.message
    };
  }
};

export default httpTrigger;
