import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as azure from 'azure-storage';
import * as util from 'util';

import { dishPartitionKey, dishTableName } from './../Shared/configuration';
import { Dish } from './../Shared/dish';
import { DishEntity } from './../Shared/dish-entity';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const dish = req.body;

  if (dish) {
    try {
      await updateDish(dish);
      context.res = {
        status: 204
      };
    } catch (error) {
      context.res = {
        status: error?.statusCode ?? 500,
        body: error?.message ?? "Error updating dish"
      };
    }
  } else {
    context.res = {
      status: 400,
      body: "Please pass a valid dish in the request body"
    };
  }
};

async function updateDish(dish: Dish): Promise<void> {
  const tableService = azure.createTableService();
  const dishEntity = dishToDishEntity(dish);
  const replaceEntity = util.promisify<string, DishEntity, void>(
    tableService.replaceEntity.bind(tableService)
  );
  return replaceEntity(dishTableName, dishEntity);
}

function dishToDishEntity(dish: Dish): DishEntity {
  return new DishEntity(
    dishPartitionKey,
    dish.id,
    dish.name,
    dish.dish,
    dish.description,
    dish.portions
  );
}

export default httpTrigger;
