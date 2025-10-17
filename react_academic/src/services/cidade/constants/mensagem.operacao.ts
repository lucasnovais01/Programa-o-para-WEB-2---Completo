export function criarMensagemOperacao(ENTITY_NAME: string){
    return {
      CRIAR : {
        ACAO: `Criar novo cadastro de ${ENTITY_NAME} no sistema`,
        ERRO: `O cadastro de ${ENTITY_NAME} foi criado no sistema`, //ta trocado com o existe
        EXISTE: `Falha no cadastro de ${ENTITY_NAME} no sistema`,
        CANCELAR: `${ENTITY_NAME} já está cadastrado no sistema`,
        FIELDS: `Foi cancelado o cadastro de ${ENTITY_NAME}`
      },
    ATUALIZAR:{
        ACAO: `Atualizado o cadastro de ${ENTITY_NAME} no sistema`,
        ERRO: `Falha na atualização de ${ENTITY_NAME} no sistema`,
        NAO_EXISTE: `${ENTITY_NAME} não existe no sistema`,
        CANCELAR: `${ENTITY_NAME} já está atualizado no sistema`,
        FIELDS: `Foi cancelado a atualização de ${ENTITY_NAME}`
    },
    POR_ID: {
        ACAO: `Mostra o cadastro de ${ENTITY_NAME} no sistema`,
        SUCESSO: `Sucesso ao listar o ${ENTITY_NAME} no sistema`,
        ERRO: `Falha ao listar de ${ENTITY_NAME} no sistema`,
        NAO_EXISTE: `${ENTITY_NAME} não existe no sistema`,
        FIELDS: `Foi cancelado a atualização de ${ENTITY_NAME}`
    },
    EXCLUIR: {
        ACAO: `Excluir o cadastro de ${ENTITY_NAME} no sistema`,
        SUCESSO: `O cadastro de ${ENTITY_NAME} foi excluido no sistema`,
        ERRO: `Falha na exclusão de ${ENTITY_NAME} no sistema`,
        NAO_EXISTE: `${ENTITY_NAME} não existe no sistema`,
        FIELDS: `Foi cancelado a exclusão de ${ENTITY_NAME}`
    },
    LISTAR: {
        ACAO: `Listar de ${ENTITY_NAME} no sistema`,
        SUCESSO: `A consulta dos cadastro de ${ENTITY_NAME} foi realizado com sucesso no sistema`,
        ERRO: `Falha na consulta de ${ENTITY_NAME} no sistema`,
    },
  } 
}