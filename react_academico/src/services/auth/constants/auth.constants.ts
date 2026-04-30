import { criarMensagemOperacao } from "../../constant/mensagem.operacao";

import type { Usuario } from "../type/Auth";

const ENTITY_NAME = "Usuario";

export const AUTH = {
  ENTITY: ENTITY_NAME,

  ALIAS: "usuario",

  DADOS_INCIAIS: {
    emailUsuario: "",
    senhaUsuario: "",
  },

  FIELDS: {
    EMAIL: "emailUsuario",
    SENHA: "senhaUsuario",
  } as const,

  LABEL: {
    EMAIL: "E-mail",
    SENHA: "Senha",
  },

  TITULO: {
    LISTA: `Lista de ${ENTITY_NAME}`,
    CRIAR: `Nova ${ENTITY_NAME}`,
    ATUALIZAR: `Atualizar ${ENTITY_NAME}`,
    EXCLUIR: `Excluir ${ENTITY_NAME}`,
    CONSULTAR: `Consultar ${ENTITY_NAME}`,
  },

  INPUT_ERROR: {
    EMAIL: {
      BLANK: `O e-mail de ${ENTITY_NAME} deve ser informado`,
      VALID: `Informe um e-mail válido para ${ENTITY_NAME}`,
      STRING: `O e-mail de ${ENTITY_NAME} deve ser um texto`,
    },
    SENHA: {
      BLANK: `A senha de ${ENTITY_NAME} deve ser informada`,
      VALID: `Informe uma senha válida para ${ENTITY_NAME}`,
      MAX_LEN: `A senha de ${ENTITY_NAME} deve ter no máximo 20 caracteres`,
      MIN_LEN: `A senha de ${ENTITY_NAME} deve ter no mínimo 6 caracteres `,
      STRING: `A senha de ${ENTITY_NAME} deve ser um texto`,
    },
  },
  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};

export const fieldsUsuario: (keyof Usuario)[] = [
  AUTH.FIELDS.EMAIL,
  AUTH.FIELDS.SENHA,
];

// Aqui onde usamos o Record para criar um mapeamento entre os campos da entidade Usuario e as mensagens de erro correspondentes.
// O Record é um tipo utilitário do TypeScript que permite criar um objeto cujas chaves são de um tipo específico (neste caso, as chaves de Usuario) e os valores são de outro tipo específico (neste caso, as chaves do objeto USUARIO.INPUT_ERROR). Isso facilita a associação direta entre cada campo da entidade e a mensagem de erro correspondente, garantindo que as mensagens de erro sejam consistentes e facilmente acessíveis em todo o código.

export const mapaCampoParaMensagem: Record<
  keyof Usuario,
  keyof typeof AUTH.INPUT_ERROR
> = {
  emailUsuario: "EMAIL",
  senhaUsuario: "SENHA",
};
