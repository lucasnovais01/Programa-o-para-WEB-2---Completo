import { criarMensagemOperacao } from "../../constants/mensagem.operacao";

const ENTITY_NAME = "Quarto";

export const API_QUARTO = {
  LISTAR: "/quarto/listar",
  POR_ID: "/quarto/buscar",
  CRIAR: "/quarto/criar",
  ATUALIZAR: "/quarto/alterar",
  EXCLUIR: "/quarto/excluir",
};

export const QUARTO = {
  ENTITY: ENTITY_NAME,
  ALIAS: "quarto",
  DADOS_INICIAIS: {
    idQuarto: 0,
    codigoTipoQuarto: 0,
    numero: 0,
    statusQuarto: "LIVRE",
    andar: 0,
  },
  FIELDS: {
    ID: "idQuarto",
    CODIGO_TIPO_QUARTO: "codigoTipoQuarto",
    NUMERO: "numero",
    STATUS: "statusQuarto",
    ANDAR: "andar",
  } as const,
  LABEL: {
    NUMERO: "Número",
    CODIGO_TIPO_QUARTO: "Tipo de Quarto",
    STATUS: "Status",
    ANDAR: "Andar",
  },
  TITULO: {
    LISTA: `Lista de ${ENTITY_NAME}s`,
    CRIAR: `Novo ${ENTITY_NAME}`,
    ATUALIZAR: `Atualizar ${ENTITY_NAME}`,
    EXCLUIR: `Excluir ${ENTITY_NAME}`,
    CONSULTAR: `Consultar ${ENTITY_NAME}`,
  },
  INPUT_ERROR: {
    CODIGO_TIPO_QUARTO: { BLANK: `O tipo de quarto deve ser informado`, MIN_VAL: `O tipo de quarto deve ser um número maior que zero` },
    NUMERO: { BLANK: `O número do quarto deve ser informado`, MIN_VAL: `O número do quarto deve ser maior que zero` },
    STATUS: { BLANK: `O status do quarto deve ser informado` },
    ANDAR: { BLANK: `O andar deve ser informado`, VALID: `O andar deve ser um número válido` },
  },
  STATUS_OPTIONS: [
    { value: "LIVRE", label: "Livre" },
    { value: "OCUPADO", label: "Ocupado" },
    { value: "MANUTENCAO", label: "Manutenção" },
  ],
  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};
