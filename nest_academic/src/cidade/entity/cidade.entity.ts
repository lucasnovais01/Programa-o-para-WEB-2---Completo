import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entity/base.entity';

@Entity('CIDADE')
export class Cidade extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'ID_CIDADE',
    type: 'number',
  })
  idCidade?: number;

  @Column({
    name: 'COD_CIDADE',
    type: 'varchar2',
    length: 10,
  })
  codCidade: string = '';

  @Column({
    name: 'NOME_CIDADE',
    type: 'varchar2',
    length: 50,
  })
  nomeCidade: string = '';

  constructor(data: Partial<Cidade> = {}) {
    super();
    Object.assign(this, data);
  }
}
