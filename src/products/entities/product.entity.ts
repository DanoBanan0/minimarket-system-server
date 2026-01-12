import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    slug: string;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    barcode: string;

    @Column('text', { nullable: true })
    description: string;

    // ---MONEY---
    @Column('float', { default: 0 })
    costPrice: number;

    @Column('float', { default: 0 })
    salePriceRetail: number;

    @Column('float', { default: 0 })
    salePriceWholesale: number;

    @Column('int', { default: 0 })
    whplesaleMinCount: number;

    // ---INVENTORY---
    @Column('int', { default: 0 })
    stock: number;

    @Column('int', { default: 5 })
    minStock: number;
    
    @Column('bool', { default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}