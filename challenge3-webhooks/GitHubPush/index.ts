import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { PictureCommittedMessage } from '../Shared/picture-committed-message';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (isPushEvent(req.body)) {
    context.bindings.outputQueueItems = getQueueMessages(req.body);
  } else {
    context.res = {
      status: 400,
      body: "Invalid request body"
    };
  }
};

interface PushEvent {
  repository: Repository;
  commits: Commit[];
}

interface Repository {
  name: string;
  owner: {
    name: string;
  };
}

interface Commit {
  id: string;
  tree_id: string;
  added: string[];
}

function isPushEvent(body: any): body is PushEvent {
  return "repository" in body && "commits" in body;
}

function getQueueMessages(pushEvent: PushEvent): PictureCommittedMessage[] {
  return new Array<PictureCommittedMessage>().concat(
    ...pushEvent.commits.map(c =>
      getQueueMessagesForCommit(c, pushEvent.repository)
    )
  );
}

function getQueueMessagesForCommit(
  commit: Commit,
  repository: Repository
): PictureCommittedMessage[] {
  return commit.added.filter(isPng).map(path => ({
    repositoryOwner: repository.owner.name,
    repositoryName: repository.name,
    commitId: commit.id,
    treeId: commit.tree_id,
    path
  }));
}

function isPng(path: string): boolean {
  return /.png$/i.test(path);
}

export default httpTrigger;
