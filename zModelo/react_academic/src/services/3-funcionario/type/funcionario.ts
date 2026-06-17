export interface Funcionario {
  idUsuario?: number;
  codigoFuncao?: number;
  nomeLogin?: string;
  senha?: string;
  email?: string;
  dataContratacao?: string | Date;
  ativo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
