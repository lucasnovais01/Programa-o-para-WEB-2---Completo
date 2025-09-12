import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/* NOME FISICO DA TABELA NO BANCO DE DADOS  */
@Entity('CIDADE')
export class Cidade extends BaseEntity {
  //@PrimaryColumn() //Aqui diz, "Banco deixa comigo, eu que gerencio a chave primária"

  @PrimaryGeneratedColumn('increment', {
    name: 'ID_CIDADE',
    type: 'number',
  }) //Enquanto aqui, ao fazer um insert, um registro na tabela, estou dizendo ao banco "se virá a criar a Chave Primária"
  idCidade?: number = 0;

  @Column({
    name: 'COD_CIDADE',
    type: 'varchar2',
    length: 10,
  })
  codCidade: string = '';

  @Column({ name: 'COD_CIDADE', type: 'varchar2', length: 20 })
  nomeCidade: string = '';

  constructor(data: Partial<Cidade> = {}) {
    super();
    Object.assign(this, data);
  }
}
