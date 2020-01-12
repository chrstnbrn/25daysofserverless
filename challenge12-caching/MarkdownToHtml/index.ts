import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as Octokit from '@octokit/rest';
import * as redis from 'redis';
import * as showdown from 'showdown';
import * as util from 'util';

const redisClient = redis.createClient({
  host: process.env.REDIS_CACHE_HOST,
  tls: {
    servername: process.env.REDIS_CACHE_HOST
  },
  auth_pass: process.env.REDIS_CACHE_KEY,
  port: 6380
});

const redisGetAsync = util.promisify<string, string>(
  redisClient.get.bind(redisClient)
);
const redisSetAsync = util.promisify<string, string, void>(
  redisClient.set.bind(redisClient)
);

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const gistId = req.query.gistId;
  const fileName = req.query.fileName;

  if (gistId && fileName) {
    const html = await getHtml(gistId, fileName);
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

async function getHtml(gistId: string, fileName: string): Promise<string> {
  const id = `${gistId}_${fileName}`;
  const cachedResult = await redisGetAsync(id);

  if (cachedResult) {
    return cachedResult;
  }

  const markdown = await getGistContent(gistId, fileName);
  const html = markdownToHtml(markdown);

  await redisSetAsync(id, html);

  return html;
}

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
