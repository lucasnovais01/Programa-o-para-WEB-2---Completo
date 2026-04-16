import { criarMensagemOperacao } from '../../commons/constants/constants.entity';

const ENTITY_NAME = 'Usuario';

const MAX_LEN_CODIGO = 20;
const MIN_LEN_CODIGO = 5;

const MAX_LEN_STRING = 100;
const MIN_LEN_STRING = 5;

export const USUARIO = {
  ENTITY: ENTITY_NAME,

  TABLE: 'USUARIO',

  TABLE_FIELD: {
    ID_USUARIO: 'ID_USUARIO',
    NOME_USUARIO: 'NOME_USUARIO',
    EMAIL_USUARIO: 'EMAIL_USUARIO',
    SENHA_USUARIO: 'SENHA_USUARIO',
  },

  ALIAS: 'Usuario',

  FIELDS: {
    ID_USUARIO: 'idUsuario',
    NOME_USUARIO: 'nomeUsuario',
    EMAIL_USUARIO: 'emailUsuario',
    SENHA_USUARIO: 'senhaUsuario',
  },

  SWAGGER: {
    ID_USUARIO: `Código do ${ENTITY_NAME} de identificador único`,
    NOME_USUARIO: `Nome de ${ENTITY_NAME} cadastrado`,
    EMAIL_USUARIO: `Email de ${ENTITY_NAME} cadastrado`,
    SENHA_USUARIO: `Senha de ${ENTITY_NAME} cadastrada`,
  },

  INPUT_ERROR: {
    ID_USUARIO: {
      BLANK: `Código de ${ENTITY_NAME} deve ser informado`,
      VALID: `Código de identificador único deve ser válido para ${ENTITY_NAME}`,
    },
    NOME_USUARIO: {
      BLANK: `Nome de ${ENTITY_NAME} deve ser informado`,
      VALID: `Nome de ${ENTITY_NAME} deve ser informado`,
      MAX_LEN: `Nome de ${ENTITY_NAME} deve ter no máximo ${MAX_LEN_CODIGO}`,
      MIN_LEN: `Nome de ${ENTITY_NAME} deve ter no mínimo ${MIN_LEN_CODIGO}`,
      STRING: `Nome de ${ENTITY_NAME} deve ser do tipo texto`,
    },
    EMAIL_USUARIO: {
      BLANK: `Email de ${ENTITY_NAME} deve ser informado`,
      VALID: `Email de ${ENTITY_NAME} deve ser informado`,
      MAX_LEN: `Email de ${ENTITY_NAME} deve ter no máximo ${MAX_LEN_STRING}`,
      MIN_LEN: `Email de ${ENTITY_NAME} deve ter no mínimo ${MIN_LEN_STRING}`,
      STRING: `Email de ${ENTITY_NAME} deve ser do tipo texto`,
    },
    SENHA_USUARIO: {
      BLANK: `Senha do ${ENTITY_NAME} deve ser informado`,
      VALID: `Senha do ${ENTITY_NAME} deve ser informado`,
      MAX_LEN: `Senha do ${ENTITY_NAME} deve ter no máximo ${MAX_LEN_STRING}`,
      MIN_LEN: `Senha do ${ENTITY_NAME} deve ter no mínimo ${MIN_LEN_STRING}`,

      // Senha deve ser do tipo texto, mas pode conter caracteres especiais, números e letras, então a mensagem de validação é mais genérica
      STRING: `Senha do ${ENTITY_NAME} deve ser do tipo texto`,
    },
  },

  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};

export const fieldsUsuario = Object.values(USUARIO.FIELDS);
