import { AsyncAction } from '@/application/protocols';

export interface QueueConsumer {
  consume: (keyToConsume: string, action: AsyncAction) => Promise<void>;
}
