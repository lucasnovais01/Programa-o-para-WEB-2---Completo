export interface Quarto {
  idQuarto?: number;
  codigoTipoQuarto?: number;
  numero?: number;
  statusQuarto?: string;
  andar?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrosQuarto {
  idQuarto?: boolean;
  codigoTipoQuarto?: boolean;
  numero?: boolean;
  statusQuarto?: boolean;
  andar?: boolean;

  idQuartoMensagem?: string[];
  codigoTipoQuartoMensagem?: string[];
  numeroMensagem?: string[];
  statusQuartoMensagem?: string[];
  andarMensagem?: string[];
}