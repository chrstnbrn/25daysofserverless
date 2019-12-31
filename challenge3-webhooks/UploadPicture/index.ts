import { AzureFunction, Context } from '@azure/functions';
import * as Octokit from '@octokit/rest';

import { PictureCommittedMessage } from '../Shared/picture-committed-message';

const queueTrigger: AzureFunction = async function(
  context: Context,
  message: PictureCommittedMessage
): Promise<void> {
  context.bindings.outputBlob = await getPictureBlob(message);
};

async function getPictureBlob(
  message: PictureCommittedMessage
): Promise<Buffer> {
  const tree = await getTree(
    message.repositoryOwner,
    message.repositoryName,
    message.treeId
  );
  const pictureTreeItem = getTreeItemByPath(tree, message.path);
  return await getBlob(
    message.repositoryOwner,
    message.repositoryName,
    pictureTreeItem.sha
  );
}

async function getTree(
  repositoryOwner: string,
  repositoryName: string,
  treeId: string
): Promise<TreeItem[]> {
  const octokit = new Octokit();
  const response = await octokit.git.getTree({
    owner: repositoryOwner,
    repo: repositoryName,
    tree_sha: treeId,
    recursive: "1"
  });
  const responseData = response.data as GetTreeResponse;
  return responseData.tree;
}

function getTreeItemByPath(tree: TreeItem[], path: string): TreeItem {
  return tree.find(item => item.path === path);
}

async function getBlob(
  repositoryOwner: string,
  repositoryName: string,
  fileId: string
): Promise<Buffer> {
  const octokit = new Octokit();
  const blobResult = await octokit.git.getBlob({
    owner: repositoryOwner,
    repo: repositoryName,
    file_sha: fileId
  });
  return Buffer.from(blobResult.data.content, "base64");
}

export default queueTrigger;

interface GetTreeResponse {
  tree: TreeItem[];
  truncated: boolean;
}

interface TreeItem {
  path: string;
  type: "tree" | "blob";
  sha: string;
  size: number;
  url: string;
}
