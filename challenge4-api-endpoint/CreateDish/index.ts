import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { DishEntity } from '../Shared/dish-entity';
import { Dish } from './../Shared/dish';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (isDish(req.body)) {
    const dishEntity = new DishEntity(
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
