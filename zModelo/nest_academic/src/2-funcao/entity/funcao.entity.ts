import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('COCAO_FUNCAO')
export class Funcao extends BaseEntity {
  @PrimaryColumn({
    name: 'CODIGO_FUNCAO',
    type: 'int',
    width: 4,
  })
  codigoFuncao?: number;

  @Column({
    name: 'NOME_FUNCAO',
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  nomeFuncao: string = '';

  @Column({
    name: 'DESCRICAO',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  descricao?: string;

  @Column({
    name: 'NIVEL_ACESSO',
    type: 'int',
    width: 1,
    nullable: false,
  })
  nivelAcesso: number = 1;

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

  constructor(data: Partial<Funcao> = {}) {
    super();
    Object.assign(this, data);
  }
}
