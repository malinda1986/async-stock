import { container } from 'tsyringe';

import { Order } from '@/domain/models';
import { AddOrder, LoadOrders, ShowOrder } from '@/domain/usecases/orders';
import { HttpRequest, HttpResponse } from '@/presentation/protocols';
import { created, ok } from '@/shared/utils/http';

export class OrdersController {
  async store(request: HttpRequest): Promise<HttpResponse<Order>> {
    const { products } = request.body;
    const addOrder = container.resolve<AddOrder>('AddOrder');
    const createdOrder = await addOrder.add({ products });
    return created(createdOrder);
  }

  async index(_: HttpRequest): Promise<HttpResponse<{ orders: Order[] }>> {
    const loadOrders = container.resolve<LoadOrders>('LoadOrders');
    const orders = await loadOrders.load();
    return ok({ orders });
  }

  async show(request: HttpRequest): Promise<HttpResponse> {
    const { id } = request.pathParameters as { id: string };
    const showOrder = container.resolve<ShowOrder>('ShowOrder');
    const order = await showOrder.show(id);
    return ok(order);
  }
}
