export function criarMensagemOperacao(ENTITY_NAME: string) {
  return {
    CRIAR: {
      ACAO: `Criar novo cadastro de ${ENTITY_NAME}`,
      SUCESSO: `${ENTITY_NAME} criado com sucesso`,
      ERRO: `Erro ao criar ${ENTITY_NAME}`,
      EXISTE: `${ENTITY_NAME} já cadastrado`
    },
    ATUALIZAR: {
      ACAO: `Atualizar cadastro de ${ENTITY_NAME}`,
      SUCESSO: `${ENTITY_NAME} atualizado com sucesso`,
      ERRO: `Erro ao atualizar ${ENTITY_NAME}`,
      NAO_EXISTE: `${ENTITY_NAME} não encontrado`
    },
    POR_ID: {
      ACAO: `Buscar ${ENTITY_NAME} por ID`,
      SUCESSO: `${ENTITY_NAME} encontrado com sucesso`,
      ERRO: `Erro ao buscar ${ENTITY_NAME}`,
      NAO_EXISTE: `${ENTITY_NAME} não encontrado`
    },
    EXCLUIR: {
      ACAO: `Excluir cadastro de ${ENTITY_NAME}`,
      SUCESSO: `${ENTITY_NAME} excluído com sucesso`,
      ERRO: `Erro ao excluir ${ENTITY_NAME}`,
      NAO_EXISTE: `${ENTITY_NAME} não encontrado`
    },
    LISTAR: {
      ACAO: `Listar todos os ${ENTITY_NAME}`,
      SUCESSO: `Lista de ${ENTITY_NAME} carregada com sucesso`,
      ERRO: `Erro ao carregar lista de ${ENTITY_NAME}`
    }
  };
}