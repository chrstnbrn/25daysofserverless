import { Message } from './message';

export interface MessageWithId extends Message {
  id: string;
}
