import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entity/base.entity';
//mysql
@Entity('usuario')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ID_USUARIO' })
  idUsuario!: number;
  @Column({ name: 'COD_USUARIO' })
  codUsuario!: string;
  @Column({ name: 'NOME_USUARIO' })
  nomeUsuario!: string;
  @Column({ name: 'EMAIL' })
  email!: string;
  @Column({ name: 'SENHA' })
  senha!: string;
  @Column({ name: 'FOTO' })
  foto!: string;
  @Column({ name: 'ID_CIDADE' })
  idCidade!: number;
  @Column({ name: 'ATIVO', default: false })
  ativo!: boolean;

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
  }
}
