const ENTITY_NAME = 'Aluno';

const MAX_LEN_CODIGO = 20;
const MIN_LEN_CODIGO = 5;

const MAX_LEN_STRING = 100;
const MIN_LEN_STRING = 5;

export const ALUNO = {
  ENTITY: ENTITY_NAME,
  TABLE: 'ALUNO',
  TABLE_FIELD: {
    ID_ALUNO: 'ID_ALUNO',
    CODIGO_ALUNO: 'COD_ALUNO',
    NOME_ALUNO: 'NOME_ALUNO',
    IDADE: 'IDADE',
  },

  ALIAS: 'Aluno',

  FIELDS: {
    ID_ALUNO: 'idAluno',
    CODIGO_ALUNO: 'codAluno',
    NOME_ALUNO: 'nomeAluno',
    IDADE: 'idade',
  },

  SWAGGER: {
    ID_ALUNO: `Código do ${ENTITY_NAME} de identificador único`,
    CODIGO_ALUNO: `Código do ${ENTITY_NAME} cadastrado`,
    NOME_ALUNO: `Nome de ${ENTITY_NAME} `,
    IDADE: `Código do ${ENTITY_NAME} cadastrado`,
  },

  INPUT_ERROR: {
    ID_ALUNO: {
      BLANK: `Código de ${ENTITY_NAME} deve ser informado`,
      VALID: `Código de identificador único deve ser válido para ${ENTITY_NAME}`,
    },
    COD_ALUNO: {
      BLANK: `Código de ${ENTITY_NAME} deve ser informado`,
      VALID: `Código de ${ENTITY_NAME} deve ser informado`,
      MAX_LEN: `Código de ${ENTITY_NAME} deve ter no máximo ${MAX_LEN_CODIGO}`,
      MIN_LEN: `Código de ${ENTITY_NAME} deve ter no mínimo ${MIN_LEN_CODIGO}`,
      STRING: `Código de ${ENTITY_NAME} deve ser do tipo texto`,
    },
    NOME_ALUNO: {
      BLANK: `Nome de ${ENTITY_NAME} deve ser informado`,
      VALID: `Nome de ${ENTITY_NAME} deve ser informado`,
      MAX_LEN: `Nome de ${ENTITY_NAME} deve ter no máximo ${MAX_LEN_STRING}`,
      MIN_LEN: `Nome de ${ENTITY_NAME} deve ter no mínimo ${MIN_LEN_STRING}`,
      STRING: `Nome de ${ENTITY_NAME} deve ser do tipo texto`,
    },
    IDADE_ALUNO: {
      BLANK: `Idade de ${ENTITY_NAME} deve ser informado`,
      VALID: `Idade de ${ENTITY_NAME} deve ser informado`,
      INT: ``,
    },
  },
};
