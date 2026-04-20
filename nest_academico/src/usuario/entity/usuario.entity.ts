import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entity/base.entity';

@Entity('Usuario')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'ID_USUARIO',
    type: 'int',
  })
  idUsuario?: number;

  @Column({
    name: 'NOME_USUARIO',
    type: 'varchar',
    length: 50,
  })
  nomeUsuario: string = '';

  @Column({
    name: 'SOBRENOME_USUARIO',
    type: 'varchar',
    length: 50,
  })
  sobrenomeUsuario: string = '';

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

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
  }
}

/* 
 @Column({
    name: 'COD_CIDADE',
    type: 'varchar',
    length: 10,
  })
  codCidade: string = '';

*/
