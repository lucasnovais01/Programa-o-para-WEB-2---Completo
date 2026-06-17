// Objetivo: Gerar rotas RESTful completas e padronizadas.

import {
  HOSPEDE,
  FUNCAO,
  FUNCIONARIO,
  TIPO_QUARTO,
  QUARTO,
  STATUS_RESERVA,
  RESERVA,
  SERVICO,
  HOSPEDE_SERVICO,
} from './constants.sistema';

// URLs do Sistema COCAO HOTEL

export const SERVIDOR = 'http://localhost:8000';
export const CLIENTE = 'http://localhost:3000';

// Aqui eu coloquei a versão da API para facilitar futuras manutenções
// Coloquei mais informação no arquivo zSobre o V1.md

// Pode ser retirad, só deletar API_VERSION e usar:
// const ROTA_SISTEMA = 'rest/sistema';
// const ROTA_AUTH = 'rest/auth';

const API_VERSION = 'v1';
export const ROTA_SISTEMA = `rest/sistema/${API_VERSION}`; // Exemplo: /rest/sistema/v1/hospede/listar
// Precisa do export pra usar no hateoas.utils.ts, mas não tem mais função, pois as rotas estão sendo geradas pela função gerarRotasSistema
// pq não tem mais função, pois as rotas estão sendo geradas pela função gerarRotasSistema, mas mantive aqui pra não quebrar o código do hateoas.utils.ts
const ROTA_AUTH = `rest/auth/${API_VERSION}`;

// Ações REST padronizadas

const LIST = 'listar';
const CREATE = 'criar';
const BY_ID = 'buscar/:id';
const UPDATE = 'alterar/:id';
const DELETE = 'excluir/:id';

// Gera rotas completas para uma entidade. Exemplo: /rest/sistema/v1/hospede/listar
// Retorna um objeto com todas as rotas para a entidade fornecida
// o base serve como base para as outras rotas
// pois é a junção da rota do sistema com o nome da entidade

// Exemplo: gerarRotasSistema('hospede') retorna:
// {
//   BASE: '/rest/sistema/v1/hospede',
//   LIST: '/rest/sistema/v1/hospede/listar',
//   CREATE: '/rest/sistema/v1/hospede/criar',
//   BY_ID: '/rest/sistema/v1/hospede/buscar/:id',
//   UPDATE: '/rest/sistema/v1/hospede/alterar/:id',
//   DELETE: '/rest/sistema/v1/hospede/excluir/:id',
// }

/**
 * Gera as rotas para uma entidade do sistema.

 * IMPORTANTE SOBRE A BARRA INICIAL '/':
 * ----------------------------------
 * 1. Mantemos a barra inicial aqui para:
 *    - Manter o padrão do professor
 *    - Facilitar a visualização da rota completa
 *    - Manter consistência com a documentação
 * 
 * 2. No controller, removemos a barra usando .substring(1)
 *    Exemplo:
 *    - Aqui: "/rest/sistema/v1/hospede"
 *    - No controller: "rest/sistema/v1/hospede"
 * 
 * 3. Esta abordagem permite:
 *    - Manter o padrão de rotas consistente
 *    - Adaptar para o NestJS sem mudar a estrutura
 *    - Facilitar debug e logs
 */

// Não está servindo pra mais nada, a functio abaixo, foi substituída por ENDPOINTS
// Helper function to get only the endpoint part of a route (after the base)
/*
function getEndpoint(fullPath: string, base: string): string {
  return fullPath.replace(base + '/', '');
}
*/

function gerarRotasSistema(entity: string) {
  const base = `/${ROTA_SISTEMA}/${entity}`;
  const routes = {
    BASE: base,
    LIST: `${base}/${LIST}`,
    CREATE: `${base}/${CREATE}`,
    BY_ID: `${base}/${BY_ID}`,
    UPDATE: `${base}/${UPDATE}`,
    DELETE: `${base}/${DELETE}`,
  };

  /*
// Código do meu Professor, mantive aqui só pra referência, mas não é mais usado

function gerarRotasSistema(entity: string) {
  const base = `/${ROTA_SISTEMA}/${entity}`;
  return {
    BASE: base,
    LIST: `/${LIST}`,
    CREATE: `/${CREATE}`,
    BY_ID: `/${BY_ID}/:id`,
    UPDATE: `/${UPDATE}/:id`,
    DELETE: `/${DELETE}/:id`,
  };
}
*/

  // Adiciona uma estrutura ENDPOINTS que contém apenas o sufixo da rota
  // (sem a base). Isso facilita o uso em decorators do NestJS
  // sem causar duplicação quando o @Controller já fornece a base.
  const endpoints = {
    LIST: LIST, // 'listar'
    CREATE: CREATE, // 'criar'
    BY_ID: BY_ID, // 'buscar/:id'
    UPDATE: UPDATE, // 'alterar/:id'
    DELETE: DELETE, // 'excluir/:id'
  };

  return {
    ...routes,
    /*
    como tava antes, mas agora está usando a const endpoints

    getListEndpoint: () => getEndpoint(routes.LIST, base),
    getCreateEndpoint: () => getEndpoint(routes.CREATE, base),
    getByIdEndpoint: () => getEndpoint(routes.BY_ID, base),
    getUpdateEndpoint: () => getEndpoint(routes.UPDATE, base),
    getDeleteEndpoint: () => getEndpoint(routes.DELETE, base),
    */

    ENDPOINTS: endpoints,
  };
}

// Rotas do sistema (entidades)

export const ROTA = {
  HOSPEDE: gerarRotasSistema(HOSPEDE),
  FUNCAO: gerarRotasSistema(FUNCAO),
  FUNCIONARIO: gerarRotasSistema(FUNCIONARIO),
  TIPO_QUARTO: gerarRotasSistema(TIPO_QUARTO),
  QUARTO: gerarRotasSistema(QUARTO),
  STATUS_RESERVA: gerarRotasSistema(STATUS_RESERVA),
  RESERVA: gerarRotasSistema(RESERVA),
  SERVICO: gerarRotasSistema(SERVICO),
  HOSPEDE_SERVICO: gerarRotasSistema(HOSPEDE_SERVICO),
};

// Rotas de autenticação (separadas para evitar conflito). Observação: Futuro AuthModule

export const AUTH_ROUTES = {
  BASE: `/${ROTA_AUTH}`,
  LOGIN: `/${ROTA_AUTH}/login`,
  LOGOUT: `/${ROTA_AUTH}/logout`,
  ME: `/${ROTA_AUTH}/me`,
  REFRESH: `/${ROTA_AUTH}/refresh`,
};
