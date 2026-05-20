import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  /*  @DeleteDateColumn({ name: 'DELETE_AT' })
  deleteAt!: Date; */

  constructor(data: Partial<BaseEntity> = {}) {
    Object.assign(this, data);
  }
}
