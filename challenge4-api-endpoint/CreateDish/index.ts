import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as uuidv4 from 'uuid/v4';

import { DishEntity } from '../Shared/dish-entity';
import { dishPartitionKey } from './../Shared/configuration';
import { Dish } from './../Shared/dish';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (isDish(req.body)) {
    const dishEntity = new DishEntity(
      dishPartitionKey,
      uuidv4(),
      req.body.name,
      req.body.dish,
      req.body.description,
      req.body.portions
    );

    context.bindings.dish = dishEntity;

    context.res = {
      status: 201,
      body: `${dishEntity.RowKey}`
    };
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

export default httpTrigger;
