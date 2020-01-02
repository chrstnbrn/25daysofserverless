import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as azure from 'azure-storage';

import { dishTableName } from '../Shared/configuration';
import { Dish } from '../Shared/dish';
import { dishEntityToDish } from '../Shared/dish-entity-to-dish';
import { dishPartitionKey } from './../Shared/configuration';
import { DishEntity } from './../Shared/dish-entity';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const dishes = await getAllDishes();
    context.res = {
      body: dishes
    };
  } catch (error) {
    context.res = {
      status: error?.statusCode ?? 500,
      body: error?.message ?? "Error loading dishes"
    };
  }
};

async function getAllDishes(): Promise<Dish[]> {
  const dishEntities = await getAllDishEntities();
  return dishEntities.map(dishEntityToDish);
}

async function getAllDishEntities(): Promise<DishEntity[]> {
  const tableService = azure.createTableService();
  const query = new azure.TableQuery().where(
    `PartitionKey eq '${dishPartitionKey}'`
  );
  const options: azure.TableService.TableEntityRequestOptions = {
    payloadFormat: "application/json;odata=nometadata"
  };
  return queryAll<DishEntity>(tableService, dishTableName, query, options);
}

async function queryAll<T>(
  tableService: azure.TableService,
  tableName: string,
  query: azure.TableQuery,
  options: azure.TableService.TableEntityRequestOptions,
  continuationToken: azure.TableService.TableContinuationToken = null
): Promise<T[]> {
  const queryEntities = promisifyQueryEntities<T>(tableService);

  const [entities, newContinuationToken] = await queryEntities(
    tableName,
    query,
    continuationToken,
    options
  );

  if (newContinuationToken) {
    const otherEntities = await queryAll<T>(
      tableService,
      tableName,
      query,
      options,
      continuationToken
    );
    return [...entities, ...otherEntities];
  }

  return entities;
}

function promisifyQueryEntities<T>(tableService: azure.TableService) {
  return (
    table: string,
    query: azure.TableQuery,
    token: azure.TableService.TableContinuationToken,
    options: azure.TableService.TableEntityRequestOptions
  ) =>
    new Promise<[T[], azure.TableService.TableContinuationToken]>(
      (resolve, reject) => {
        tableService.queryEntities(
          table,
          query,
          token,
          options,
          (error, result, response) =>
            error
              ? reject(error)
              : resolve([response.body["value"], result.continuationToken])
        );
      }
    );
}

export default httpTrigger;
