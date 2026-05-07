import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entity/base.entity';

export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: ID_USUARIO })
  idUsuario!: number;

  @Column({ name: 'COD_USUARIO' })
  codUsuario!: string;

  @Column({ name: 'NOME_USUARIO' })
  nome_usuario!: string;

  @Column({ name: 'EMAIL_USUARIO' })
  email_usuario!: string;

  @Column({ name: 'SENHA' })
  senha!: string;

  @Column({ name: 'FOTO' })
  foto!: string;

  @Column({ name: 'ID_CIDADE' })
  id_cidade!: number;

  @Column({ name: 'ATIVO', default: false })
  ativo!: boolean;
  /*
  senhaUsuario: string;
  sobrenomeUsuario: string;
  emailUsuario: string;
  nomeUsuario: string;
*/
  constructor(data: Partial<Usuario> = {}) {
    Object.assign(this.data);
  }
}

// No banco de dados está:
/*
export class Usuario
CREATE TABLE USUARIO (
    ID_USUARIO INT AUTO_INCREMENT NOT NULL,
    COD_USUARIO VARCHAR(10) UNIQUE NOT NULL,
    NOME_USUARIO VARCHAR(50),
    EMAIL VARCHAR(100),
    SENHA VARCHAR(100),
    FOTO VARCHAR(200),
    TIPO INT DEFAULT 1 NOT NULL, -- 1(PROFESSOR), 2(ALUNO)
    ID_CIDADE INT NOT NULL,
    ATIVO INT DEFAULT 1,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT PK_USUARIO PRIMARY KEY (ID_USUARIO),
    CONSTRAINT FK_USUARIO_CIDADE FOREIGN KEY (ID_CIDADE) REFERENCES CIDADE(ID_CIDADE)
);

*/
