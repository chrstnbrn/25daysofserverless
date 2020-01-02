import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as azure from 'azure-storage';
import * as util from 'util';

import { dishPartitionKey, dishTableName } from './../Shared/configuration';
import { TableEntity } from './../Shared/table-entity';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const id = req.params.id;

  try {
    await deleteDishEntity(id);
    context.res = {
      status: 204
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error }
    };
  }
};

async function deleteDishEntity(id: string): Promise<void> {
  const tableService = azure.createTableService();
  const dishToDelete = new TableEntity(dishPartitionKey, id);
  const deleteEntity = util.promisify<string, TableEntity, void>(
    tableService.deleteEntity.bind(tableService)
  );
  return deleteEntity(dishTableName, dishToDelete);
}

export default httpTrigger;
