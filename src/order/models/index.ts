import { CartItem } from '../../cart/models';

export type Order = {
  id?: string,
  userId: string;
  cartId: string;
  items: CartItem[]
  payment: {
    type: string,
    address?: any,
    creditCard?: any,
  } | string,
  delivery: {
    type: string,
    address: any,
  } | string,
  comments: string,
  status: string;
  total: number;
}

export enum OrderStatus {
  IN_PROGRESS = 'inProgress'
}
