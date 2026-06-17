import { criarMensagemOperacao } from "../../constants/mensagem.operacao";
import type { Auth } from "../type/Auth";

// ENTITY_NAME reflete o módulo de autenticação, não o usuário
const ENTITY_NAME = "Login";

export const AUTH = {
  ENTITY: ENTITY_NAME,

  // ALIAS usado para gerar a URL: /sistema/auth/login
  ALIAS: "auth",

  // Valores iniciais do formulário de login
  DADOS_INICIAIS: {
    loginUsuario: "",
    senhaUsuario: "",
  },

  FIELDS: {
    LOGIN: "loginUsuario",
    SENHA: "senhaUsuario",
  } as const,

  LABEL: {
    LOGIN: "Login ou e-mail",
    SENHA: "Senha",
  },

  // Login só tem uma tela, então removi LISTA/CRIAR/ATUALIZAR/EXCLUIR
  TITULO: {
    LOGIN: `${ENTITY_NAME}`,
  },

  INPUT_ERROR: {
    LOGIN: {
      BLANK: `O login ou e-mail deve ser informado`,
      VALID: `Informe um login ou e-mail válido`,
      STRING: `O login deve ser um texto`,
    },
    SENHA: {
      BLANK: `A senha deve ser informada`,
      VALID: `Informe uma senha válida`,
      MAX_LEN: `A senha deve ter no máximo 20 caracteres`,
      MIN_LEN: `A senha deve ter no mínimo 6 caracteres`,
      STRING: `A senha deve ser um texto`,
    },
  },

  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};

// Renomeado para fieldsAuth, não é campos de Usuario, é campos do form de login
export const fieldsAuth: (keyof Auth)[] = [
  AUTH.FIELDS.LOGIN,
  AUTH.FIELDS.SENHA,
];

// Mapeamento dos campos do formulário para as mensagens de erro
export const mapaCampoParaMensagem: Record<
  keyof Auth,
  keyof typeof AUTH.INPUT_ERROR
> = {
  loginUsuario: "LOGIN",
  senhaUsuario: "SENHA",
};