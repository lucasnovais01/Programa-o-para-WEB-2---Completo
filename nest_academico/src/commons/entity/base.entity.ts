import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  /*
  // O DDL atual do banco não possui soft delete. Se precisar usar soft delete,
  // deve ser mapeado em outro campo, por exemplo DELETE_AT, e não em UPDATED_AT.
  @DeleteDateColumn({ name: 'DELETE_AT' })
  deleteAt!: Date;
  */

  constructor(data: Partial<BaseEntity> = {}) {
    Object.assign(this, data);
  }
}
