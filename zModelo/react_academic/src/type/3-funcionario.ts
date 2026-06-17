export interface Funcionario {
  idUsuario?: number;
  codigoFuncao?: number;
  nomeLogin?: string;
  senha?: string;
  dataContratacao?: string | Date;
  ativo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface errosFuncionario {
  idUsuario?: boolean;
  codigoFuncao?: boolean;
  nomeLogin?: boolean;
  senha?: boolean;
  dataContratacao?: boolean;
  ativo?: boolean;

  idUsuarioMensagem?: string[];
  codigoFuncaoMensagem?: string[];
  nomeLoginMensagem?: string[];
  senhaMensagem?: string[];
  dataContratacaoMensagem?: string[];
  ativoMensagem?: string[];
}