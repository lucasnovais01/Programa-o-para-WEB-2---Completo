import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../commons/entity/base.entity';

@Entity('RegistroUsuario')
export class Registro extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'ID_USUARIO',
    type: 'int',
  })
  idUsuario?: number;

  @Column({
    name: 'NOME_CIDADE',
    type: 'varchar',
    length: 50,
  })
  nomeUsuario: string = '';

  /*
  Poderia ser o campo de sobrenome do usuario
*/

  @Column({
    name: 'EMAIL',
    type: 'varchar',
    length: 100,
  })
  email: string = '';

  @Column({
    name: 'SENHA',
    type: 'varchar',
    length: 100,
  })
  senha: string = '';
  /*
  Poderia ser o campo de confirmar a senha do usuario
*/
  constructor(data: Partial<Registro> = {}) {
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
