import { Expose } from 'class-transformer';

export class FuncaoResponse {
  @Expose()
  // Código da função (chave primária).
  codigoFuncao?: number;

  @Expose()
  // Nome da função (cargo).
  nomeFuncao: string = '';

  @Expose()
  // Descrição da função
  descricao?: string;

  @Expose()
  // Nível de acesso: 1=Básico, 2=Intermediário, 3=Gerencial
  nivelAcesso: number = 1;

  @Expose()
  // Timestamp de criação
  createdAt: Date = new Date();

  @Expose()
  // Timestamp de atualização
  updatedAt: Date = new Date();
}
