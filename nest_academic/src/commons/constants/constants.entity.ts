export function criarMensagemOperacao(ENTITY_NAME: string) {
  return {
    CRIAR: {
      ACAO: `Criar novo cadastro de ${ENTITY_NAME} no sistema`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi criado com sucesso`,
      ERROR: `Falha na Criação do cadastro de ${ENTITY_NAME} no sistema`,
      EXISTE: `${ENTITY_NAME} já está cadastrado no sistema`,
    },
    ATUALIZAR: {
      ACAO: `Atualizar o cadastro de ${ENTITY_NAME} no sistema`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi atualizado com sucesso`,
      ERROR: `Falha na atualização no cadastro de ${ENTITY_NAME} no sistema`,
      NAO_LOCALIZADO: `O código informado para o cadastro de ${ENTITY_NAME} não foi localizado no sistema`,
    },
    POR_ID: {
      ACAO: `Exibir o cadastro de ${ENTITY_NAME} no sistema`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi localizado com sucesso`,
      //ERROR: `O cadastro de ${ENTITY_NAME} não foi localizado no sistema`,
      NAO_LOCALIZADO: `O código informado para a busca de ${ENTITY_NAME} não foi localizado no sistema`,
    },
    EXCLUIR: {
      ACAO: `O cadastro de ${ENTITY_NAME} por um identificador único no sistema`,
      SUCESSO: `O cadastro de ${ENTITY_NAME} foi excluido com sucesso`,
      NAO_LOCALIZADO: `O código informado para a busca de ${ENTITY_NAME} não foi localizado no sistema`,
    },
    LISTAR: {
      ACAO: `Listagem do cadastro de ${ENTITY_NAME} no sistema`,
      SUCESSO: `A consulta dos cadastros de ${ENTITY_NAME}s foi realizada com sucesso`,
      NAO_LOCALIZADO: `Falha na consulta dos cadastros ${ENTITY_NAME}s no sistema`,
    },
  };
}
