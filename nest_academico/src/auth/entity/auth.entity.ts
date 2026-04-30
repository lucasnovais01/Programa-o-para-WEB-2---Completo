// Não existe tabela Auth no banco, e portanto não deve existir uma entidade Auth.
// O serviço de auth é responsável por autenticar usuários existentes, não por criar um novo tipo de entidade.
// A autenticação é um processo que envolve a verificação das informações do usuário, e não a criação de uma nova entidade,
// por isso o serviço de auth interage diretamente com a entidade Usuario. O código relacionado à entidade Auth
// foi removido para refletir essa realidade e evitar confusões.
/*

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

*/

/*
O que o serviço de auth faz é:

Recebe email + senha
Busca na tabela Usuario
Compara a senha
Retorna o token JWT

*/
