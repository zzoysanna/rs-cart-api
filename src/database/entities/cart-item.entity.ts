import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryColumn({type: 'uuid', nullable: false})
  productId: string

  @Column({type: 'int', nullable: false})
  count: number

  @Column({type: 'uuid', nullable: false})
  cartId: string
}
