import { Context, HttpRequest } from '@azure/functions';
import { matchers } from 'jest-json-schema';

import getPosadas from '.';
import posadas from '../posadas.json';
import schema from '../posadas.schema.json';

expect.extend(matchers);

describe("posadas", () => {
  it("should return posadas", async () => {
    const request = {} as HttpRequest;
    const context = { res: {} } as Context;

    await getPosadas(context, request);

    expect(context.res.body).toEqual(posadas);
  });

  it("should return result that matches schema", async () => {
    const request = {} as HttpRequest;
    const context = { res: {} } as Context;

    await getPosadas(context, request);

    expect(context.res.body).toMatchSchema(schema);
  });
});
