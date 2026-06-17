import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('COCAO_FUNCIONARIO')
export class Funcionario extends BaseEntity {
  @PrimaryColumn({
    name: 'ID_USUARIO',
    type: 'int',
  })
  idUsuario?: number;

  @Column({
    name: 'CODIGO_FUNCAO',
    type: 'int',
    width: 4,
    nullable: false,
  })
  codigoFuncao?: number;

  @Column({
    name: 'NOME_LOGIN',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  nomeLogin: string = '';

  @Column({
    name: 'SENHA',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  senha: string = '';

  @Column({
    name: 'EMAIL',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  email?: string | null;

  @Column({
    name: 'DATA_CONTRATACAO',
    type: 'date',
    nullable: false,
  })
  dataContratacao: Date = new Date();

  // O campo de refreshToken é opcional e pode ser nulo, pois nem todos os funcionários terão um token de atualização ativo.

  @Column({
    name: 'REFRESH_TOKEN',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refreshToken?: string | null;

  @Column({
    name: 'ATIVO',
    type: 'int',
    nullable: false,
    default: 1,
  })
  ativo: number = 1;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    nullable: false,
  })
  createdAt?: Date;

  @Column({
    name: 'UPDATED_AT',
    type: 'timestamp',
    nullable: false,
  })
  updatedAt?: Date;

  constructor(data: Partial<Funcionario> = {}) {
    super();
    Object.assign(this, data);
  }
}
