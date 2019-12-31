export interface PictureCommittedMessage {
  repositoryOwner: string;
  repositoryName: string;
  commitId: string;
  treeId: string;
  path: string;
}
