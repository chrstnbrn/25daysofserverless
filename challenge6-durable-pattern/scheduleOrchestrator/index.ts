import * as df from 'durable-functions';

import { ScheduledNotification } from '../Shared/scheduled-notification';

const orchestrator = df.orchestrator(function*(context) {
  const scheduledNotification = context.df.getInput() as ScheduledNotification;
  const date = new Date(scheduledNotification.date);
  yield context.df.createTimer(date);

  return yield context.df.callActivity(
    "sendNotification",
    scheduledNotification
  );
});

export default orchestrator;
