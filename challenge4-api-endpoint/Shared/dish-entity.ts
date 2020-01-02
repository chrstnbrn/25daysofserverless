import { TableEntity } from './table-entity';

export class DishEntity extends TableEntity {
  constructor(
    partitionKey: string,
    rowKey: string,
    public name: string,
    public dish: string,
    public description: string,
    public portions: number
  ) {
    super(partitionKey, rowKey);
  }
}
