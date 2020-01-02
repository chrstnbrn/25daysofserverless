import { Dish } from './dish';
import { DishEntity } from './dish-entity';

export function dishEntityToDish(dishEntity: DishEntity): Dish {
  return {
    id: dishEntity.RowKey,
    name: dishEntity.name,
    dish: dishEntity.dish,
    description: dishEntity.description,
    portions: dishEntity.portions
  };
}
