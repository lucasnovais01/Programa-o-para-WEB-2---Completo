export interface TipoQuarto {
  codigoTipoQuarto?: number;
  nomeTipo?: string;
  capacidadeMaxima?: number;
  valorDiaria?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrosTipoQuarto {
  codigoTipoQuarto?: boolean;
  nomeTipo?: boolean;
  capacidadeMaxima?: boolean;
  valorDiaria?: boolean;

  codigoTipoQuartoMensagem?: string[];
  nomeTipoMensagem?: string[];
  capacidadeMaximaMensagem?: string[];
  valorDiariaMensagem?: string[];
}
