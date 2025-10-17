
const ENTITY_NAME = 'Cidade'

export const CIDADE = {

  ENTITY: ENTITY_NAME,

  ALIAS: 'cidade',

  DADOS_INICIAIS: {
    idCodigo: '',
    codCidade: '',
    nomeCidade: '',
  },

  FIELDS: {
    ID: 'idCidade',
    CODIGO: 'codCidade',
    NOME: 'nomeCidade',
    
  } as const,


  LABEL: {
    ID: 'Código',
  },

  TITULO: {
    LISTA : `Lista de ${ENTITY_NAME}`,
    CRIAR : `Nova ${ENTITY_NAME}`,
    ATUALIZAR: `Atualizar ${ENTITY_NAME}`,
    EXCLUIR: `Excluir ${ENTITY_NAME}`,
    CONSULTAR: `Consultar ${ENTITY_NAME}`,
  },

  INPUT_ERROR: {
    ID: {
      BLANK: `O código de identificação do ${ENTITY_NAME} deve ser informado`,
      VALID: `Informe um código de identificação válido para ${ENTITY_NAME}`,
      MAX_LEN: `O código de ${ENTITY_NAME} deve ter no máximo 20 caracteres`,
      MIN_LEN: `O código de ${ENTITY_NAME} deve ter no mínimo 6 caracteres`,
      STRING:  `O código de ${ENTITY_NAME} deve ser um texto`,
    },
    CODIGO : {
      BLANK: `O nome de identificação do ${ENTITY_NAME} deve ser informado`,
      VALID: `Informe no nome de identificação válido para ${ENTITY_NAME}`,
      MAX_LEN: `O nome de ${ENTITY_NAME} deve ter no máximo 20 caracteres`,
      MIN_LEN: `O nome de ${ENTITY_NAME} deve ter no mínimo 6 caracteres`,
      STRING:  `O nome de ${ENTITY_NAME} deve ser um texto`,
    },
    NOME : {

    },
  },

}

