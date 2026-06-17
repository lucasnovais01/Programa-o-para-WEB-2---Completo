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
	codigoFuncaoMensagem?: string[];
	nomeFuncao?: boolean;
	nomeFuncaoMensagem?: string[];
	descricao?: boolean;
	descricaoMensagem?: string[];
	nivelAcesso?: boolean;
	nivelAcessoMensagem?: string[];
}

