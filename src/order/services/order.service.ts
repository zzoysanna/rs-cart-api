import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import {OrderEntity} from '../../database/entities/order.entity';
import { Order, OrderStatus } from '../models';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class OrderService {

  constructor(
      @InjectRepository(OrderEntity) private readonly ordersRepo: Repository<OrderEntity>,
      @InjectConnection() private readonly connection: Connection,
  ) {}

  findById(orderId: string): Promise<Partial<Order>> {
    return this.ordersRepo.findOne({id: orderId});
  }

  async create(data: any): Promise<boolean> {
    const order = {
      ...data,
      status: OrderStatus.IN_PROGRESS,
    };
    console.log(order);
    try {
      await this.ordersRepo.insert(order)
    } catch (e) {
      throw new Error(e.message)
    }
    return true;
  }

  async update(orderId, data): Promise<Order> {
    try {
      const order = await this.findById(orderId);
      const newOrder = {
        ...order,
        ...data
      }
      return this.ordersRepo.save(newOrder)
    } catch (error) {
      throw new Error('Order does not exist.');
    }
  }
}
