import { dishPartitionKey } from './configuration';
import { Dish } from './dish';
import { DishEntity } from './dish-entity';

export function dishToDishEntity(dish: Dish): DishEntity {
  return new DishEntity(
    dishPartitionKey,
    dish.id,
    dish.name,
    dish.dish,
    dish.description,
    dish.portions
  );
}
