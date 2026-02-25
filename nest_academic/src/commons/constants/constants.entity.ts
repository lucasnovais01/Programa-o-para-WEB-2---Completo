export function criarMensagemOperacao(ENTITY_NAME: string) {
  return {
    CRIAR: {
      ACAO: `Criar novo cadastro de ${ENTITY_NAME} no sistema`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi criado com sucesso`,
      ERROR: `Falha na Criação do cadastro de ${ENTITY_NAME} no sistema`,
      EXISTE: `${ENTITY_NAME} já está cadastrado no sistema`,
    },
    ATUALIZAR: {},
    POR_ID: {},
    EXCLUIR: {},
    LISTAR: {},
  };
}
