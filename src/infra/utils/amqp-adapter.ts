import { Channel, connect, ConsumeMessage } from 'amqplib';

import { QueueConsumer, AsyncAction } from '@/application/protocols';

export class AMQPAdapter implements QueueConsumer {
  private channel: Channel;

  private exchange: string;

  async setupConnection(connectionUrl: string, exchangeName: string): Promise<void> {
    const conn = await connect(connectionUrl);
    this.channel = await conn.createChannel();
    this.exchange = exchangeName;
    await this.setupExchange(exchangeName);
  }

  private async setupExchange(exchange: string): Promise<void> {
    await this.channel.assertExchange(exchange, 'direct', {
      durable: true,
    });
  }

  async consume(keyToConsume: string, action: AsyncAction): Promise<void> {
    if (!this.channel) {
      throw new Error('No channel found in the actual instance, please set up a connection first');
    }

    const q = await this.channel.assertQueue('', { exclusive: true });
    await this.channel.bindQueue(q.queue, this.exchange, keyToConsume);

    await this.channel.consume(
      q.queue,
      async (message) => {
        message?.content &&
          (await action.handle({
            data: message.content.toString(),
          }));
        this.channel.ack(message as ConsumeMessage);
      },
      { noAck: false }
    );
  }
}
