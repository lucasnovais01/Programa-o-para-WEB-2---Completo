// aqui é onde vou programar minha lógica

import { identity } from 'rxjs';
import { ROTA_SISTEMA } from 'src/commons/constants/url.sistema';

// SE FOSSE USAR import { CIDADE } from "src/cidade/constants/cidade.constants"; E ENTÃO entidade = [CIDADE]

// Conforme vamos progredir no projeto, vamos alimentando este camadarada pro HATEOAS funcionar

// O que é um endpoint > é a rota da API, a url
// ou seja, vamos formar uma estrutura de formação que vai guardar a URL

type VERBO_HTTP = 'PUT' | 'POST' | 'GET' | 'DELETE';

export interface Resource {
  // sempre que for tipar, ou é interface ou type, então Resource é explicito que é um tipo
  link: string;
  name: string; //'cidade'
  endpoint: string; //'/cidade/listar'
  method: VERBO_HTTP[];
}

const ENTIDADES = [
  'CIDADE',
  'RESOURCE',
  'USUARIO',
  'REGISTRO',
  'DISCIPLINA',
  'PROFESSOR',
  'ALUNO',
];

export const Resources: Resource[] = ENTIDADES.flatMap((entity) =>
  buildResource(entity),
);

export function buildResource(entityName: string): Resource[] {
  const entityPath = entityName.toLowerCase();

  const base = `/${ROTA_SISTEMA}/${entityPath}`;

  return [
    {
      link: 'listar',
      name: entityPath,
      endpoint: `${base}/listar`, //PRIMEIRO CHAMA A BASE E DEPOIS O TIPO
      method: ['GET'],
    },
    {
      link: 'criar',
      name: entityPath,
      endpoint: `${base}/criar`, //PRIMEIRO CHAMA A BASE E DEPOIS O TIPO
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
/*
function methodoBase(): VERBO_HTTP[] {
  return ['GET', 'POST'];
}

function methodoId(): VERBO_HTTP[] {
  return ['PUT', 'DELETE', 'GET'];
}
*/
