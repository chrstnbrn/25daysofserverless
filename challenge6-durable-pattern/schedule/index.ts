import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import axios from 'axios';
import * as chrono from 'chrono-node';
import * as df from 'durable-functions';
import { IHttpResponse } from 'durable-functions/lib/src/classes';
import * as moment from 'moment-timezone';
import * as querystring from 'querystring';

import { ScheduledNotification } from '../Shared/scheduled-notification';
import { SlackCommandRequest } from '../Shared/slack-command-request';
import { SlackUser } from '../Shared/slack-user';

const httpStart: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<IHttpResponse> {
  const request = (querystring.parse(
    req.body
  ) as unknown) as SlackCommandRequest;

  const userTimeZone = await getUserTimeZone(request.user_id);
  const scheduleDate = getScheduleDate(request.text, userTimeZone);

  const scheduledNotification: ScheduledNotification = {
    date: scheduleDate.toISOString(),
    text: request.text
  };

  const client = df.getClient(context);
  const instanceId = await client.startNew(
    "scheduleOrchestrator",
    undefined,
    scheduledNotification
  );

  context.log(`Started orchestration with ID = '${instanceId}'.`);

  return {
    status: 200,
    body: getResultBody(scheduledNotification, userTimeZone)
  };
};

async function getUserTimeZone(userId: string): Promise<string> {
  const user = await getUser(userId);
  return user.user.tz;
}

async function getUser(userId: string): Promise<SlackUser> {
  const getUserInfoRequest = {
    token: process.env.SLACK_ACCESS_TOKEN,
    user: userId
  };
  const query = querystring.stringify(getUserInfoRequest);
  const url = `https://slack.com/api/users.info?${query}`;

  const response = await axios.get<SlackUser>(url);
  return response.data;
}

function getScheduleDate(text: string, userTimeZone: string): Date {
  const referenceDate = moment().tz(userTimeZone);
  const scheduleDateInUserTimeZone = chrono.parseDate(
    text,
    referenceDate
  ) as Date;

  const scheduleDateInUserTimeZoneString = moment(
    scheduleDateInUserTimeZone
  ).format("YYYY-MM-DDTHH:mm:ss");

  return moment.tz(scheduleDateInUserTimeZoneString, userTimeZone).toDate();
}

function getResultBody(
  scheduledNotification: ScheduledNotification,
  userTimeZone: string
): string {
  const scheduledDate = new Date(scheduledNotification.date);
  const scheduledDateString = scheduledDate.toLocaleString("en-US", {
    timeZone: userTimeZone
  });

  return `${scheduledNotification.text} has been scheduled for ${scheduledDateString}`;
}

export default httpStart;
