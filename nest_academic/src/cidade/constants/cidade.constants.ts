import { criarMensagemOperacao } from 'src/commons/constants/constants.entity';

const ENTITY_NAME = 'CIDADE';

const MAX_LEN_CODIGO = 20;
const MIN_LEN_CODIGO = 5;

const MAX_LEN_STRING = 100;
const MIN_LEN_STRING = 5;

export const CIDADE = {
  ENTITY: ENTITY_NAME,
  TABLE: 'CIDADE',
  TABLE_FIELD: {
    ID_CIDADE: 'ID_CIDADE',
    CODIGO_CIDADE: 'COD_CIDADE',
    NOME_CIDADE: 'NOME_CIDADE',
    IDADE: 'IDADE',
  },

  ALIAS: 'Cidade',

  FIELDS: {
    ID_CIDADE: 'idCidade',
    CODIGO_CIDADE: 'codCidade',
    NOME_CIDADE: 'nomeCidade',
    IDADE: 'idade',
  },

  SWAGGER: {
    ID_CIDADE: `Código do ${ENTITY_NAME} de identificador único`,
    CODIGO_CIDADE: `Código do ${ENTITY_NAME} cadastrado`,
    NOME_CIDADE: `Nome de ${ENTITY_NAME} `,
    IDADE: `Código do ${ENTITY_NAME} cadastrado`,
  },

  INPUT_ERROR: {
    ID_CIDADE: {
      BLANK: `Código de ${ENTITY_NAME} deve ser informado`,
      VALID: `Código de identificador único deve ser válido para ${ENTITY_NAME}`,
    },
    COD_CIDADE: {
      BLANK: `Código de ${ENTITY_NAME} deve ser informado`,
      VALID: `Código de ${ENTITY_NAME} deve ser informado`,
      MAX_LEN: `Código de ${ENTITY_NAME} deve ter no máximo ${MAX_LEN_CODIGO}`,
      MIN_LEN: `Código de ${ENTITY_NAME} deve ter no mínimo ${MIN_LEN_CODIGO}`,
      STRING: `Código de ${ENTITY_NAME} deve ser do tipo texto`,
    },
    NOME_CIDADE: {
      BLANK: `Nome de ${ENTITY_NAME} deve ser informado`,
      VALID: `Nome de ${ENTITY_NAME} deve ser informado`,
      MAX_LEN: `Nome de ${ENTITY_NAME} deve ter no máximo ${MAX_LEN_STRING}`,
      MIN_LEN: `Nome de ${ENTITY_NAME} deve ter no mínimo ${MIN_LEN_STRING}`,
      STRING: `Nome de ${ENTITY_NAME} deve ser do tipo texto`,
    },
    IDADE_CIDADE: {
      BLANK: `Idade de ${ENTITY_NAME} deve ser informado`,
      VALID: `Idade de ${ENTITY_NAME} deve ser informado`,
      INT: ``,
    },
  },

  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};
