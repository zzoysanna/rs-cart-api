import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column({type: 'uuid', nullable: false})
  userId: string

  @Column({type: 'timestamp', nullable: false})
  createdAt: string

  @Column({type: 'timestamp', nullable: false})
  updatedAt: string

  @Column({type: 'text', nullable: false})
  status: string
}
