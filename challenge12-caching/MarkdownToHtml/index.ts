import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as Octokit from '@octokit/rest';
import * as showdown from 'showdown';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const gistId = req.query.gistId;
  const fileName = req.query.fileName;

  if (gistId && fileName) {
    const gist = await getGistContent(gistId, fileName);
    const html = markdownToHtml(gist);

    context.res = {
      headers: {
        "content-type": "text/html"
      },
      body: `<!DOCTYPE html>\n${html}`
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass gistId and fileName in the query string"
    };
  }
};

async function getGistContent(
  gistId: string,
  fileName: string
): Promise<string> {
  const octokit = new Octokit();
  const response = await octokit.gists.get({ gist_id: gistId });
  return response.data.files[fileName]?.content;
}

function markdownToHtml(markdown: string) {
  const converter = new showdown.Converter();
  return converter.makeHtml(markdown);
}

export default httpTrigger;
