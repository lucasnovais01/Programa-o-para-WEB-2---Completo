import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entity/base.entity';

@Entity('usuario')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ID_USUARIO' })
  idUsuario!: number;

  @Column({ name: 'NOME_USUARIO' })
  nomeUsuario!: string;

  @Column({ name: 'SOBRENOME_USUARIO' })
  sobrenomeUsuario!: string;

  @Column({ name: 'EMAIL', unique: true })
  // email!: string; // COCAO utilizou email!: e senha!:, mas eu escrevi emailUsuario!: e senhaUsuario!: para manter o padrão de nomeação com o restante do código
  emailUsuario!: string;

  @Column({ name: 'SENHA' })
  senhaUsuario!: string;
  email: any;

  /*
  // Campos do DDL modelo do professor, mantidos como comentário:
  @Column({ name: 'COD_USUARIO' })
  codUsuario!: string;

  @Column({ name: 'FOTO' })
  foto!: string;

  @Column({ name: 'ID_CIDADE' })
  idCidade!: number;

  @Column({ name: 'ATIVO', default: false })
  ativo!: boolean;
  */

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
  }
}
