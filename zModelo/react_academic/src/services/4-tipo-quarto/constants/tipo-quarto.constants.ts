import { criarMensagemOperacao } from "../../constants/mensagem.operacao";

const ENTITY_NAME = "Tipo de Quarto";

export const API_TIPO_QUARTO = {
  LISTAR: "/tipo-quarto/listar",
  POR_ID: "/tipo-quarto/buscar",
  CRIAR: "/tipo-quarto/criar",
  ATUALIZAR: "/tipo-quarto/alterar",
  EXCLUIR: "/tipo-quarto/excluir",
};

export const TIPO_QUARTO = {
  ENTITY: ENTITY_NAME,
  ALIAS: "tipoQuarto",
  DADOS_INICIAIS: {
    codigoTipoQuarto: 0,
    nomeTipo: "",
    capacidadeMaxima: 2,
    valorDiaria: 0,
  },
  FIELDS: {
    CODIGO: "codigoTipoQuarto",
    NOME: "nomeTipo",
    CAPACIDADE: "capacidadeMaxima",
    VALOR_DIARIA: "valorDiaria",
  } as const,
  LABEL: {
    NOME: "Nome do Tipo",
    CAPACIDADE: "Capacidade Máxima",
    VALOR_DIARIA: "Valor da Diária",
  },
  TITULO: {
    LISTA: `Lista de ${ENTITY_NAME}s`,
    CRIAR: `Novo ${ENTITY_NAME}`,
    ATUALIZAR: `Atualizar ${ENTITY_NAME}`,
    EXCLUIR: `Excluir ${ENTITY_NAME}`,
    CONSULTAR: `Consultar ${ENTITY_NAME}`,
  },
  INPUT_ERROR: {
    CODIGO: { BLANK: `O código do tipo de quarto deve ser informado`, MIN_VAL: `O código do tipo de quarto deve ser um número maior que zero` },
    NOME: { BLANK: `O nome do tipo de quarto deve ser informado` },
    CAPACIDADE: { BLANK: `A capacidade máxima deve ser informada`, MIN_VAL: `A capacidade máxima deve ser maior que zero` },
    VALOR_DIARIA: { BLANK: `O valor da diária deve ser informado`, MIN_VAL: `O valor da diária deve ser maior que zero` },
  },
  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};
