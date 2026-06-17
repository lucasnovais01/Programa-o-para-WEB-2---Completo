import { criarMensagemOperacao } from "../../constants/mensagem.operacao";

const ENTITY_NAME = "Funcionário";

export const API_FUNCIONARIO = {
  LISTAR: "/funcionario/listar",
  POR_ID: "/funcionario/buscar",
  CRIAR: "/funcionario/criar",
  ATUALIZAR: "/funcionario/alterar",
  EXCLUIR: "/funcionario/excluir",
};

export const FUNCIONARIO = {
  ENTITY: ENTITY_NAME,
  ALIAS: "funcionario",
  DADOS_INICIAIS: {
    idUsuario: 0,
    codigoFuncao: 0,
    nomeLogin: "",
    senha: "",
    email: "",
    dataContratacao: "",
    ativo: 1,
  },
  FIELDS: {
    ID: "idUsuario",
    CODIGO_FUNCAO: "codigoFuncao",
    NOME_LOGIN: "nomeLogin",
    SENHA: "senha",
    EMAIL: "email",
    DATA_CONTRATACAO: "dataContratacao",
    ATIVO: "ativo",
  } as const,
  LABEL: {
    NOME_LOGIN: "Nome de Login",
    SENHA: "Senha",
    EMAIL: "E-mail",
    CODIGO_FUNCAO: "Código da Função",
    DATA_CONTRATACAO: "Data de Contratação",
    ATIVO: "Ativo",
  },
  TITULO: {
    LISTA: `Lista de ${ENTITY_NAME}s`,
    CRIAR: `Novo ${ENTITY_NAME}`,
    ATUALIZAR: `Atualizar ${ENTITY_NAME}`,
    EXCLUIR: `Excluir ${ENTITY_NAME}`,
    CONSULTAR: `Consultar ${ENTITY_NAME}`,
  },
  INPUT_ERROR: {
    NOME_LOGIN: { BLANK: `O nome de login deve ser informado` },
    SENHA: { BLANK: `A senha deve ser informada` },
    CODIGO_FUNCAO: { BLANK: `O código da função deve ser informado` },
    DATA_CONTRATACAO: { BLANK: `A data de contratação deve ser informada` },
  },
  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};
