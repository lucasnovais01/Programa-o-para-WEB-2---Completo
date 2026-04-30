import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../commons/entity/base.entity';

@Entity('Auth')
export class Auth extends BaseEntity {
  @Column({
    name: 'EMAIL',
    type: 'varchar',
    length: 100,
  })
  emailUsuario: string = '';

  @Column({
    name: 'SENHA',
    type: 'varchar',
    length: 100,
  })
  senhaUsuario: string = '';

  constructor(data: Partial<Auth> = {}) {
    super();
    Object.assign(this, data);
  }
}
