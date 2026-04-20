import { criarMensagemOperacao } from "../../constant/mensagem.operacao";
import type { Usuario } from "../type/Usuario";

const ENTITY_NAME = "Usuario";

export const USUARIO = {
  ENTITY: ENTITY_NAME,

  ALIAS: "usuario",

  DADOS_INCIAIS: {
    idUsuario: "",
    nomeUsuario: "",
    sobrenomeUsuario: "",
    emailUsuario: "",
    senhaUsuario: "",
    confirmarSenhaUsuario: "",
  },

  FIELDS: {
    ID: "idUsuario",
    NOME: "nomeUsuario",
    SOBRENOME: "sobrenomeUsuario",
    EMAIL: "emailUsuario",
    SENHA: "senhaUsuario",
    CONFIRMAR_SENHA: "confirmarSenhaUsuario",
  } as const,

  LABEL: {
    ID: "Identificação",
    NOME: "Nome",
    SOBRENOME: "Sobrenome",
    EMAIL: "E-mail",
    SENHA: "Senha",
    CONFIRMAR_SENHA: "Confirmar Senha",
  },

  TITULO: {
    LISTA: `Lista de ${ENTITY_NAME}`,
    CRIAR: `Nova ${ENTITY_NAME}`,
    ATUALIZAR: `Atualizar ${ENTITY_NAME}`,
    EXCLUIR: `Excluir ${ENTITY_NAME}`,
    CONSULTAR: `Consultar ${ENTITY_NAME}`,
  },

  INPUT_ERROR: {
    ID: {
      BLANK: `O código de identificação do ${ENTITY_NAME} deve ser informado`,
      VALID: `Informe um código de identificação válido para ${ENTITY_NAME}`,
    },
    NOME: {
      BLANK: `O nome de ${ENTITY_NAME} deve ser informado`,
      VALID: `Informe um nome válido para ${ENTITY_NAME}`,
      MAX_LEN: `O nome de ${ENTITY_NAME} deve ter no máximo 20 caracteres`,
      MIN_LEN: `O nome de ${ENTITY_NAME} deve ter no mínimo 3 caracteres `,
      STRING: `O nome de ${ENTITY_NAME} deve ser um texto`,
    },
    SOBRENOME: {
      BLANK: `O sobrenome de ${ENTITY_NAME} deve ser informado`,
      VALID: `Informe um sobrenome válido para ${ENTITY_NAME}`,
      MAX_LEN: `O sobrenome de ${ENTITY_NAME} deve ter no máximo 20 caracteres`,
      MIN_LEN: `O sobrenome de ${ENTITY_NAME} deve ter no mínimo 3 caracteres `,
      STRING: `O sobrenome de ${ENTITY_NAME} deve ser um texto`,
    },
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
    CONFIRMAR_SENHA: {
      BLANK: `A confirmação de senha de ${ENTITY_NAME} deve ser informada`,
      NOT_MATCH: `A confirmação de senha não confere com a senha`,
      STRING: `A confirmação de senha de ${ENTITY_NAME} deve ser um texto`,
    },
  },

  OPERACAO: criarMensagemOperacao(ENTITY_NAME),
};

export const fieldsUsuario: (keyof Usuario)[] = [
  USUARIO.FIELDS.ID,
  USUARIO.FIELDS.NOME,
  USUARIO.FIELDS.SOBRENOME,
  USUARIO.FIELDS.EMAIL,
  USUARIO.FIELDS.SENHA,
  USUARIO.FIELDS.CONFIRMAR_SENHA,
];

// Aqui onde usamos o Record para criar um mapeamento entre os campos da entidade Usuario e as mensagens de erro correspondentes.
// O Record é um tipo utilitário do TypeScript que permite criar um objeto cujas chaves são de um tipo específico (neste caso, as chaves de Usuario) e os valores são de outro tipo específico (neste caso, as chaves do objeto USUARIO.INPUT_ERROR). Isso facilita a associação direta entre cada campo da entidade e a mensagem de erro correspondente, garantindo que as mensagens de erro sejam consistentes e facilmente acessíveis em todo o código.

export const mapaCampoParaMensagem: Record<
  keyof Usuario,
  keyof typeof USUARIO.INPUT_ERROR
> = {
  idUsuario: "ID",
  nomeUsuario: "NOME",
  sobrenomeUsuario: "SOBRENOME",
  emailUsuario: "EMAIL",
  senhaUsuario: "SENHA",
  confirmarSenhaUsuario: "CONFIRMAR_SENHA",
};
