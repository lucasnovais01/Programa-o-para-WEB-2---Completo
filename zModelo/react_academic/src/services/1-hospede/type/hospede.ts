export interface Hospede {
  idUsuario?: number;
  nomeHospede?: string;
  cpf?: string;
  rg?: string;
  sexo?: string;
  dataNascimento?: string | Date;
  email?: string;
  telefone?: string;
  tipo?: number;
  ativo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}


// Feito na última aula

export interface ErrosHospede {
  idUsuario?: boolean;
  nomeHospede?: boolean;
  nomeCidade?: boolean;
  cpf?: boolean;
  rg?: boolean;
  sexo?: boolean;
  dataNascimento?: boolean;
  email?: boolean;
  telefone?: boolean;
  tipo?: boolean;
  ativo?: boolean;

  idUsuarioMensagem?: string[];
  nomeHospedeMensagem?: string[];
  cpfMensagem?: string[];
  rgMensagem?: string[];
  sexoMensagem?: string[];
  dataNascimentoMensagem?: string[];
  emailMensagem?: string[];
  telefoneMensagem?: string[];
  tipoMensagem?: string[];
  ativoMensagem?: string[];
}