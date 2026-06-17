import { Expose } from 'class-transformer';

export class FuncionarioResponse {
  @Expose()
  idUsuario?: number;

  @Expose()
  codigoFuncao?: number;

  @Expose()
  nomeLogin: string = '';

  @Expose()
  email?: string;

  @Expose()
  dataContratacao: Date = new Date();

  @Expose()
  ativo: number = 1;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;
}
