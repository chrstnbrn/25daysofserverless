import { AzureFunction, Context } from '@azure/functions';
import axios from 'axios';

import { Wish } from '../Shared/wish';

const cosmosDBTrigger: AzureFunction = async function(
  context: Context,
  wishes: Wish[]
): Promise<void> {
  if (!wishes || wishes.length === 0) {
    context.log("No wishes were provided");
  }

  for (const wish of wishes) {
    await sendSlackNotification(wish);
  }
};

async function sendSlackNotification(wish: Wish) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const text = `New wish from ${wish.from}.\n Description: ${wish.description}\n Type of present: ${wish.typeOfPresent}\nAddress: ${wish.address}`;
  await axios.post(webhookUrl, { text });
}

export default cosmosDBTrigger;
