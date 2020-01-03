import { TextAnalyticsClient, TextAnalyticsModels } from '@azure/cognitiveservices-textanalytics';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';

import { Message } from '../Shared/message';
import { MessageWithId } from '../Shared/message-with-id';
import { NaughtyOrNiceResult } from '../Shared/naughty-or-nice-result';

const naughtyOrNice: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const messages = req.body as Message[];

  if (messages) {
    try {
      const result = await getResult(messages);
      context.res = {
        body: result
      };
    } catch (error) {
      context.res = {
        status: 500,
        body: error?.message
      };
    }
  } else {
    context.res = {
      status: 400,
      body: "Please provide an array of messages in the request body"
    };
  }
};

async function getResult(messages: Message[]): Promise<NaughtyOrNiceResult[]> {
  const messagesWithIds = toMessagesWithIds(messages);
  const languagesForMessages = await getLanguagesForMessages(messagesWithIds);
  const sentimentsForMessages = await getSentimentsForMessages(
    messagesWithIds,
    languagesForMessages
  );
  const sentimentsPerPerson = getSentimentsPerPerson(
    messagesWithIds,
    sentimentsForMessages
  );
  return getNaughtyOrNiceResults(sentimentsPerPerson);
}

function toMessagesWithIds(messages: Message[]): MessageWithId[] {
  return messages.map((message, index) => ({ ...message, id: `${index + 1}` }));
}

async function getLanguagesForMessages(
  messages: MessageWithId[]
): Promise<Map<string, string>> {
  const client = getTextAnalyticsClient();

  const options: TextAnalyticsModels.TextAnalyticsClientDetectLanguageOptionalParams = {
    languageBatchInput: {
      documents: toLanguageInputs(messages)
    }
  };
  const result = await client.detectLanguage(options);

  const mapEntries = result.documents.map(
    d => [d.id, d.detectedLanguages[0]?.iso6391Name] as [string, string]
  );
  return new Map(mapEntries);
}

async function getSentimentsForMessages(
  messages: MessageWithId[],
  languagesForMessages: Map<string, string>
): Promise<Map<string, number>> {
  const client = getTextAnalyticsClient();

  const options: TextAnalyticsModels.TextAnalyticsClientSentimentOptionalParams = {
    multiLanguageBatchInput: {
      documents: toMultiLanguageInputs(messages, languagesForMessages)
    }
  };

  const result = (await client.sentiment(
    options
  )) as TextAnalyticsModels.SentimentBatchResult;

  const mapEntries = result.documents.map(
    d => [d.id, d.score] as [string, number]
  );
  return new Map(mapEntries);
}

function getTextAnalyticsClient(): TextAnalyticsClient {
  const textAnalyticsKey = process.env["textAnalyticsKey"];
  const textAnalyticsEndPoint = process.env["textAnalyticsEndPoint"];
  const credentials = new CognitiveServicesCredentials(textAnalyticsKey);
  return new TextAnalyticsClient(credentials, textAnalyticsEndPoint);
}

function toLanguageInputs(
  messages: MessageWithId[]
): TextAnalyticsModels.LanguageInput[] {
  return messages.map(message => ({
    id: message.id,
    text: message.message
  }));
}

function toMultiLanguageInputs(
  messages: MessageWithId[],
  languagesForMessages: Map<string, string>
): TextAnalyticsModels.MultiLanguageInput[] {
  return messages.map(message => ({
    id: message.id,
    text: message.message,
    language: languagesForMessages.get(message.id)
  }));
}

function getSentimentsPerPerson(
  messages: MessageWithId[],
  sentimentsForMessages: Map<string, number>
): Map<string, number[]> {
  const persons = [...new Set(messages.map(m => m.who))];
  const mapEntries = persons.map(
    p =>
      [p, getSentimentsForPerson(p, messages, sentimentsForMessages)] as [
        string,
        number[]
      ]
  );
  return new Map(mapEntries);
}

function getSentimentsForPerson(
  personName: string,
  messages: MessageWithId[],
  sentimentsForMessages: Map<string, number>
): number[] {
  return messages
    .filter(m => m.who === personName)
    .map(m => sentimentsForMessages.get(m.id));
}

function getNaughtyOrNiceResults(
  sentimentsPerPerson: Map<string, number[]>
): NaughtyOrNiceResult[] {
  return [...sentimentsPerPerson.entries()].map(([name, sentiments]) =>
    getNaughtyOrNiceResult(name, sentiments)
  );
}

function getNaughtyOrNiceResult(
  name: string,
  sentiments: number[]
): NaughtyOrNiceResult {
  const averageSentiment = average(sentiments);
  return {
    name,
    sentiments,
    averageSentiment,
    result: averageSentiment < 0.5 ? "naughty" : "nice"
  };
}

function average(numbers: number[]): number {
  return numbers && numbers.length ? sum(numbers) / numbers.length : null;
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export default naughtyOrNice;
