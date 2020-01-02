import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as azure from 'azure-storage';

import { Dish } from '../Shared/dish';
import { dishEntityToDish } from '../Shared/dish-entity-to-dish';
import { dishPartitionKey, dishTableName } from './../Shared/configuration';
import { DishEntity } from './../Shared/dish-entity';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const id = req.params.id;

  try {
    const dish = await getDishById(id);
    context.res = {
      body: dish
    };
  } catch (error) {
    context.res = {
      status: error?.statusCode ?? 500,
      body: error?.message ?? "Error loading dish"
    };
  }
};

async function getDishById(id: string): Promise<Dish> {
  const dishEntity = await retrieveDishEntity(id);
  return dishEntityToDish(dishEntity);
}

async function retrieveDishEntity(id: string): Promise<DishEntity> {
  const tableService = azure.createTableService();
  return new Promise((resolve, reject) =>
    tableService.retrieveEntity(
      dishTableName,
      dishPartitionKey,
      id,
      (error, result, response) =>
        error
          ? reject(error)
          : resolve((response.body as unknown) as DishEntity)
    )
  );
}

export default httpTrigger;
