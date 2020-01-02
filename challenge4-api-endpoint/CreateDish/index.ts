import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as azure from 'azure-storage';
import * as util from 'util';
import * as uuidv4 from 'uuid/v4';

import { dishToDishEntity } from '../Shared/dish-to-dish-entity';
import { dishTableName } from './../Shared/configuration';
import { Dish } from './../Shared/dish';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (isDish(req.body)) {
    const id = uuidv4();
    try {
      await createDishEntity({ ...req.body, id });
      context.res = {
        status: 201,
        body: id
      };
    } catch (error) {
      context.res = {
        status: error?.statusCode ?? 500,
        body: error?.message ?? "Error creating dish"
      };
    }
  } else {
    context.res = {
      status: 400,
      body: "Please pass a name and a dish in the request body"
    };
  }
};

function isDish(dish: any): dish is Dish {
  return "name" in dish && "dish" in dish;
}

async function createDishEntity(dish: Dish): Promise<void> {
  const tableService = azure.createTableService();
  const dishEntity = dishToDishEntity(dish);
  const insertEntity = util.promisify(
    tableService.insertEntity.bind(tableService)
  );
  await insertEntity(dishTableName, dishEntity);
}

export default httpTrigger;
