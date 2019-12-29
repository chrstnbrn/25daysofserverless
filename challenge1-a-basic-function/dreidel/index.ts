import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.res = {
    body: getDreidelResult()
  };
};

function getDreidelResult() {
  const values = ["נ (Nun)", "ג (Gimmel)", "ה (Hay)", "ש (Shin)"];
  const index = getRandomInteger(values.length);
  return values[index];
}

function getRandomInteger(upperBound: number) {
  return Math.floor(Math.random() * upperBound);
}

export default httpTrigger;
