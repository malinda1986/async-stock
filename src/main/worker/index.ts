import { container } from 'tsyringe';

import { AMQPAdapter } from '@/infra';
import { connectionUrl, defaultExchange } from '@/config/rabbitmq';
import { QueueConsumer } from '@/application/protocols';
import { DecrementAction, IncrementAction } from '@/application/actions';

const setUpConsumer = async (consumer: QueueConsumer) => {
  await consumer.consume('incremented', container.resolve(IncrementAction));
  await consumer.consume('decremented', container.resolve(DecrementAction));
};

const init = () => {
  return async () => {
    try {
      const amqp = new AMQPAdapter();
      await amqp.setupConnection(connectionUrl, defaultExchange);
      await setUpConsumer(amqp);
    } catch (error) {
      console.error('Error trying to set up the queue consumer', error);
    }
  };
};

export default init();
