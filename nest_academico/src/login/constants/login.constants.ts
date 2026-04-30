import { criarMensagemOperacao } from '../../commons/constants/constants.entity';

const ENTITY_NAME = 'LOGIN';

export const USUARIO = {
  ENTITY: ENTITY_NAME,

  TABLE: 'LOGIN',

  TABLE_FIELD: {
    EMAIL_USUARIO: 'EMAIL_USUARIO',
    SENHA_USUARIO: 'SENHA_USUARIO',
  },

  ALIAS: 'Login',

  FIELDS: {
    EMAIL_USUARIO: 'emailUsuario',
    SENHA_USUARIO: 'senhaUsuario',
  },

  SWAGGER: {
    EMAIL_USUARIO: `Email de ${ENTITY_NAME} correto`,
    SENHA_USUARIO: `Senha de ${ENTITY_NAME} correta`,
  },

  INPUT_ERROR: {
    EMAIL_USUARIO: {
      BLANK: `Email de ${ENTITY_NAME} deve ser informado`,
      VALID: `Email de ${ENTITY_NAME} deve ser informado`,
      STRING: `Email de ${ENTITY_NAME} deve ser do tipo texto`,
    },
    SENHA_USUARIO: {
      BLANK: `Senha do ${ENTITY_NAME} deve ser informado`,
      VALID: `Senha do ${ENTITY_NAME} deve ser informado`,
      // Senha deve ser do tipo texto, mas pode conter caracteres especiais, números e letras, então a mensagem de validação é mais genérica
      STRING: `Senha do ${ENTITY_NAME} deve ser do tipo texto`,
    },
  },

  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};

export const fieldsLogin = Object.values(LOGIN.FIELDS);
