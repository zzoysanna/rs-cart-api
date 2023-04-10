import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: 'uuid', nullable: false})
    userId: string

    @Column({type: 'uuid', nullable: false})
    cartId: string

    @Column({type: 'json', nullable: false})
    payment: string

    @Column({type: 'json', nullable: false})
    delivery: string

    @Column({type: 'text', nullable: false})
    comments: string

    @Column({type: 'text', nullable: false})
    status: string

    @Column({type: 'int', nullable: false})
    total: number
}
