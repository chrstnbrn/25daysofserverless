import * as uuidv4 from 'uuid/v4';

import { dishPartitionKey } from './configuration';
import { TableEntity } from './table-entity';

export class DishEntity extends TableEntity {
  constructor(
    public name: string,
    public dish: string,
    public description: string,
    public portions: number
  ) {
    super(dishPartitionKey, uuidv4());
  }
}
