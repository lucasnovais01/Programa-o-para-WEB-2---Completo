import { criarMensagemOperacao } from "../../constants/mensagem.operacao";

const ENTITY_NAME = "Função";

export const API_FUNCAO = {
	LISTAR: '/funcao/listar',
	POR_ID: '/funcao/buscar',
	CRIAR: '/funcao/criar',
	ATUALIZAR: '/funcao/alterar',
	EXCLUIR: '/funcao/excluir',
};

export const FUNCAO = {
	ENTITY: ENTITY_NAME,
	ALIAS: "funcao",
	DADOS_INICIAIS: {
		codigoFuncao: 0,
		nomeFuncao: "",
		descricao: "",
		nivelAcesso: 1,
	},
	FIELDS: {
		CODIGO: 'codigoFuncao',
		NOME: 'nomeFuncao',
		DESCRICAO: 'descricao',
		NIVEL_ACESSO: 'nivelAcesso',
	} as const,
	LABEL: {
		NOME: 'Função',
		DESCRICAO: 'Descrição',
		NIVEL_ACESSO: 'Nível de Acesso',
	},
	TITULO: {
		LISTA: `Lista de ${ENTITY_NAME}s`,
		CRIAR: `Nova ${ENTITY_NAME}`,
		ATUALIZAR: `Atualizar ${ENTITY_NAME}`,
		EXCLUIR: `Excluir ${ENTITY_NAME}`,
		CONSULTAR: `Consultar ${ENTITY_NAME}`,
	},
	INPUT_ERROR: {
		NOME: { BLANK: `O nome da ${ENTITY_NAME} deve ser informado` },
		NIVEL_ACESSO: { BLANK: `O nível de acesso deve ser informado` },
	},
	OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};

