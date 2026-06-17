import {
  FUNCAO,
  FUNCIONARIO,
  HOSPEDE,
  QUARTO,
  TIPO_QUARTO,
} from '../../commons/constants/constants.sistema';
import { ROTA_SISTEMA } from '../../commons/constants/url.sistema';

type VERBO_HTTP = 'PUT' | 'POST' | 'GET' | 'DELETE';

/**
 * ============================================================================
 * RESOURCE - O que é e como funciona?
 * ============================================================================
 *
 * Um "Resource" é um mapa de metadados que descreve os endpoints disponíveis
 * no backend para uma entidade (ex: Hospede, Funcionario, Quarto).
 *
 * Ele contém:
 * - link: Um identificador curto (ex: 'listar', 'criar')
 * - name: O nome da entidade (ex: 'hospede', 'funcionario')
 * - endpoint: A URL completa do endpoint (ex: '/rest/hospedes/listar')
 * - method: Qual verbo HTTP ele aceita (ex: ['GET'], ['POST'])
 *
 * Exemplo prático:
 * {
 *   link: 'listar',
 *   name: 'hospede',
 *   endpoint: '/rest/hospede/listar',
 *   method: ['GET']
 * }
 *
 * ONDE ESTÁ SENDO USADO:
 * 1. Backend (NestJS):
 *    - Este arquivo (resources.ts) gera o mapa de recursos dinamicamente
 *    - O ResourceController (8-resources/controllers) retorna essa lista para o frontend
 *    - É consumido via GET /rest/resources
 *
 * 2. Frontend (React):
 *    - ResourcesProviders (React) busca essa lista do backend na primeira carga
 *    - Armazena em sessionStorage para evitar requisições desnecessárias
 *    - O hook useResources() permite qualquer componente acessar a lista
 *    - getEndpoint(name, id?) retorna a URL sem prop drilling
 *
 * VANTAGEM:
 * - Centralizamos TODAS as URLs em um único lugar
 * - O frontend não precisa colocar URLs hardcoded espalhadas no código
 * - Se mudarmos uma rota, só precisamos atualizar aqui
 * - HATEOAS: a API "conta" ao cliente quais operações estão disponíveis
 */
export interface Resource {
  link: string;
  name: string;
  endpoint: string;
  method: VERBO_HTTP[];
}

const ENTIDADES = [HOSPEDE, FUNCAO, FUNCIONARIO, TIPO_QUARTO, QUARTO];

/**
 * ============================================================================
 * buildResources() - Construtor dinâmico de recursos
 * ============================================================================
 *
 * Para cada entidade (Hospede, Funcionario, etc):
 * 1. Define o caminho base: /rest/{entidade}/
 * 2. Gera 5 recursos padrão (CRUD + listar):
 *    - listar: GET /rest/{entidade}/listar
 *    - criar: POST /rest/{entidade}/criar
 *    - buscar: GET /rest/{entidade}/buscar/:id
 *    - alterar: PUT /rest/{entidade}/alterar/:id
 *    - excluir: DELETE /rest/{entidade}/excluir/:id
 *
 * Resultado: Array com ~25 recursos (5 operações × 5 entidades)
 *
 * OBSERVAÇÃO IMPORTANTE:
 * Esse array é retornado pelo endpoint GET /rest/resources
 * O frontend (React) faz uma requisição a esse endpoint na inicialização
 * e armazena em sessionStorage (via ResourcesProviders)
 */
export const Resources: Resource[] = ENTIDADES.flatMap((entity) =>
  buildResource(entity),
);

/**
 * ============================================================================
 * buildResource() - Factory de recursos individuais
 * ============================================================================
 *
 * Para uma entidade passada como parâmetro, cria um array com 5 operações
 * que descrevem os principais endpoints de CRUD.
 *
 * Exemplo de entrada: 'hospede'
 * Exemplo de saída:
 * [
 *   { link: 'listar', name: 'hospede', endpoint: '/rest/hospede/listar', method: ['GET'] },
 *   { link: 'criar', name: 'hospede', endpoint: '/rest/hospede/criar', method: ['POST'] },
 *   { link: 'buscar', name: 'hospede', endpoint: '/rest/hospede/buscar/:id', method: ['GET'] },
 *   { link: 'alterar', name: 'hospede', endpoint: '/rest/hospede/alterar/:id', method: ['PUT'] },
 *   { link: 'excluir', name: 'hospede', endpoint: '/rest/hospede/excluir/:id', method: ['DELETE'] },
 * ]
 *
 * ONDE É USADO NO CÓDIGO:
 * 1. Essa função é chamada para cada entidade
 * 2. Os resultados são combinados (flatMap) em um único array
 * 3. Esse array é exportado como "Resources"
 * 4. O ResourceController retorna Resources via GET /rest/resources
 */
export function buildResource(entityName: string): Resource[] {
  const entityPath = entityName.toLowerCase();
  const base = `/${ROTA_SISTEMA}/${entityPath}`;
  return [
    {
      link: 'listar',
      name: entityPath,
      endpoint: `${base}/listar`,
      method: ['GET'],
    },
    {
      link: 'criar',
      name: entityPath,
      endpoint: `${base}/criar`,
      method: ['POST'],
    },
    {
      link: 'buscar',
      name: entityPath,
      endpoint: `${base}/buscar/:id`,
      method: ['GET'],
    },
    {
      link: 'alterar',
      name: entityPath,
      endpoint: `${base}/alterar/:id`,
      method: ['PUT'],
    },
    {
      link: 'excluir',
      name: entityPath,
      endpoint: `${base}/excluir/:id`,
      method: ['DELETE'],
    },
  ];
}
