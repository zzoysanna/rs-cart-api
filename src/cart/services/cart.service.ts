import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import {CartStatus } from '../models';
import {Cart} from '../models';
import {CartEntity} from '../../database/entities/cart.entity';
import {CartItemEntity} from '../../database/entities/cart-item.entity';

@Injectable()
export class CartService {

  constructor(
      @InjectRepository(CartEntity) private readonly cartsRepo: Repository<CartEntity>,
      @InjectRepository(CartItemEntity) private readonly cartItemRepo: Repository<CartItemEntity>,
      @InjectConnection() private readonly connection: Connection,
  ) {}


  async findByUserId(userId: string): Promise<Cart | undefined> {
    const cart = await this.cartsRepo.findOne(
        {userId},
    );
    if(cart) {
      const cartId = cart.id;
      const cartItems = await this.cartItemRepo.find({cartId})
      return {...cart, items: cartItems.map(i => ({productId: i.productId, count: i.count}))};
    } {
      return undefined;
    }
  }

  async createByUserId(userId: string): Promise<boolean> {
    const userCart = {
      userId,
      status: CartStatus.OPEN
    };
    try {
      await this.cartsRepo.insert(userCart);
    } catch (e) {
      throw new Error(e.message)
    }
    return true;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      return userCart;
    }
    const isCreated = await this.createByUserId(userId);
    if(isCreated){
      return this.findByUserId(userId);
    }
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    try {
      const cart = await this.findOrCreateByUserId(userId);
      const cartId = cart.id;

      items.forEach(async item => {
        const newItem = {...item, cartId};
        const itemData = {
          productId: item.productId,
          cartId
        };
        const currentProduct = await this.cartItemRepo.findOne(itemData);
        const result = await currentProduct ? this.cartItemRepo.save(newItem) : this.cartItemRepo.insert(newItem);
      });
      return this.findOrCreateByUserId(userId);
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async removeByUserId(userId): Promise<boolean> {
    try {
      await this.cartsRepo.delete({ userId });
    } catch {
      return false;
    }
    return true;
  }

}
