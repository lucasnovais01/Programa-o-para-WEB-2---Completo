export interface Funcao {
	codigoFuncao?: number;
	nomeFuncao?: string;
	descricao?: string;
	nivelAcesso?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ErrosFuncao {
	codigoFuncao?: boolean;
	nomeFuncao?: boolean;
	descricao?: boolean;
	nivelAcesso?: boolean;

	codigoFuncaoMensagem?: string[];
	nomeFuncaoMensagem?: string[];
	descricaoMensagem?: string[];
	nivelAcessoMensagem?: string[];
}

