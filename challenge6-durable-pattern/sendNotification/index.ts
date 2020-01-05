import { AzureFunction, Context } from '@azure/functions';
import axios from 'axios';

import { ScheduledNotification } from '../Shared/scheduled-notification';

const activityFunction: AzureFunction = async function(
  context: Context
): Promise<void> {
  const input = context.bindings.payload as ScheduledNotification;
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  await axios.post(webhookUrl, {
    text: `You scheduled ${input.text} to happen now`
  });
};

export default activityFunction;
