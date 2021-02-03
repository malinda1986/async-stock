import faker from 'faker';
import amqplib from 'amqplib';

import { AMQPAdapter } from '@/infra';
import { AsyncActionMock } from '@/__tests__/doubles/mocks';

jest.mock('amqplib');
const amqpMock = amqplib as jest.Mocked<typeof amqplib>;

const sutFactory = () => {
  const sut = new AMQPAdapter();
  return {
    sut,
  };
};

const mockAmqp = () => {
  const consume = jest.fn();
  const assertQueue = jest.fn(() => ({
    queue: faker.random.word(),
  }));
  const bindQueue = jest.fn();
  const assertExchange = jest.fn();
  const createChannel = jest.fn(() => ({
    assertExchange,
    assertQueue,
    bindQueue,
    consume,
  }));
  amqpMock.connect.mockImplementationOnce(
    () =>
      ({
        createChannel,
      } as any)
  );

  return { createChannel, assertExchange, assertQueue, bindQueue, consume };
};

const connectionUrl = faker.internet.url();
const exchangeName = faker.random.word();

const setUpConnection = async (sut: AMQPAdapter) => {
  await sut.setupConnection(connectionUrl, exchangeName);
};

describe('AMQPAdapter', () => {
  describe('setupConnection', () => {
    it('should set up a new connection amqplib', async () => {
      const { sut } = sutFactory();
      const { createChannel, assertExchange } = mockAmqp();
      await sut.setupConnection(connectionUrl, exchangeName);
      expect(amqpMock.connect).toHaveBeenCalledWith(connectionUrl);
      expect(createChannel).toHaveBeenCalledTimes(1);
      expect(assertExchange).toHaveBeenCalledWith(exchangeName, 'direct', { durable: true });
    });
  });
  describe('consume', () => {
    it('should throw an error if the connection was not configured', () => {
      const { sut } = sutFactory();
      const result = sut.consume(faker.random.word(), new AsyncActionMock());
      expect(result).rejects.toThrow(
        new Error('No channel found in the actual instance, please set up a connection first')
      );
    });
    it('should bind the queue to the exchange and start to consume', async () => {
      const { sut } = sutFactory();
      const routingKey = faker.random.word();
      const asyncAction = new AsyncActionMock();
      const { assertQueue, bindQueue, consume } = mockAmqp();
      await setUpConnection(sut);
      await sut.consume(routingKey, asyncAction);
      const queue = assertQueue.mock.results[0].value.queue;
      expect(assertQueue).toHaveBeenCalledWith('', { exclusive: true });
      expect(bindQueue).toHaveBeenCalledWith(queue, exchangeName, routingKey);
      expect(consume).toHaveBeenCalledWith(queue, expect.anything(), { noAck: false });
    });
  });
});
