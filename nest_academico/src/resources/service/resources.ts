import { ROTA_SISTEMA } from '../../commons/constants/url.sistema';

type VERBO_HTTP = 'PUT' | 'POST' | 'GET' | 'DELETE';

export interface Resource {
  link: string;
  name: string;
  endpoint: string;
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
