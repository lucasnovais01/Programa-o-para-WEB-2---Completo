import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  // Este campo é importante, para evitar o soft delete
  @DeleteDateColumn({ name: 'UPDATED_AT' })
  deleteAt!: Date;

  constructor(data: Partial<BaseEntity> = {}) {
    Object.assign(this, data);
  }
}
