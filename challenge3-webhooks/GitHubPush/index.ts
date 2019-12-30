import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  if (isPushEvent(req.body)) {
    context.res = {
      body: getAddedPngPictures(req.body)
    };
  } else {
    context.res = {
      status: 400,
      body: "Invalid request body"
    };
  }
};

interface PushEvent {
  commits: [
    {
      added: string[];
    }
  ];
}

function isPushEvent(body: any): body is PushEvent {
  return "commits" in body;
}

function getAddedPngPictures(pushEvent: PushEvent): string[] {
  return getAddedFiles(pushEvent).filter(isPng);
}

function getAddedFiles(pushEvent: PushEvent): string[] {
  return new Array<string>().concat(...pushEvent.commits.map(c => c.added));
}

function isPng(path: string): boolean {
  return /.png$/i.test(path);
}

export default httpTrigger;
