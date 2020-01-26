import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { AzureFunction, Context } from '@azure/functions';
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

const blobTrigger: AzureFunction = async function(
  context: Context,
  imageBlob: Blob
): Promise<void> {
  const isPerfect = await isPerfectGift(imageBlob);

  if (isPerfect) {
    context.bindings.outputBlob = imageBlob;
  }
};

async function isPerfectGift(imageBlob: Blob): Promise<boolean> {
  const tags = await getTags(imageBlob);
  const expectedTags = ["box", "gift wrapping", "ribbon", "present"];
  return expectedTags.every(tag => tags.includes(tag));
}

async function getTags(imageBlob: Blob): Promise<string[]> {
  const result = await computerVisionClient.analyzeImageInStream(imageBlob, {
    visualFeatures: ["Tags"]
  });
  return result.tags.map(t => t.name);
}

export default blobTrigger;
