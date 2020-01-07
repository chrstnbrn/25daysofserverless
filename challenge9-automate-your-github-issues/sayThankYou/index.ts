import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as Octokit from '@octokit/rest';
import { WebhookPayloadIssues } from '@octokit/webhooks';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const issuesEvent = req.body as WebhookPayloadIssues;

  if (issuesEvent?.action === "opened") {
    const thankYouCommentBody = getThankYouCommentBody(
      issuesEvent.issue.user.login
    );
    await createIssueComment(
      issuesEvent.repository.owner.login,
      issuesEvent.repository.name,
      issuesEvent.issue.number,
      thankYouCommentBody
    );
  }
};

function getThankYouCommentBody(issueCreator: string): string {
  return `Thank you @${issueCreator} for creating this issue!`;
}

async function createIssueComment(
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
): Promise<void> {
  const accessToken = process.env.GITHUB_ACCESS_TOKEN;
  const octokit = new Octokit({
    auth: accessToken
  });
  await octokit.issues.createComment({
    owner,
    repo,
    body,
    issue_number: issueNumber
  });
}

export default httpTrigger;
