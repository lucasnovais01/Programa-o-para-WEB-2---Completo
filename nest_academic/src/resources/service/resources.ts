// aqui é onde vou programar minha lógica

// SE FOSSE USAR import { CIDADE } from "src/cidade/constants/cidade.constants"; E ENTÃO entidade = [CIDADE]

// Conforme vamos progredir no projeto, vamos alimentando este camadarada pro HATEOAS funcionar

// O que é um endpoint > é a rota da API, a url
// ou seja, vamos formar uma estrutura de formação que vai guardar a URL

type VERBO_HTTP = 'PUT' | 'POST' | 'GET' | 'DELETE';

export interface Resource {
  // sempre que for tipar, ou é interface ou type, então Resource é explicito que é um tipo
  name: string; //'cidade'
  endpoint: string; //'/cidade/listar'
  method: VERBO_HTTP;
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

export const Resources: Resource[] = ENTIDADES.flatMap((entity) => {
  buildResource(entity);
});

export function buildResource(entityName: string): Resource[] {
  const entityPath = entityName.toLowerCase();
};