import { ALUNO, CIDADE, PROFESSOR, USUARIO } from './constants.sistema';

export const SERVIDOR = 'http://localhost:8000';
export const CLINTE = 'http://localhost:3000';

const ROTA_SISTEMA = 'rest/sistema';
const ROTA_AUTH = 'rest/auth';

const LIST = 'listar';
const CREATE = 'criar';
const BY_ID = 'buscar';
const UPDATE = 'alterar';
const DELETE = 'excluir';

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

export const ROTA = {
  USUARIO: gerarRotasSistema(USUARIO),
  PROFESSOR: gerarRotasSistema(PROFESSOR),
  CIDADE: gerarRotasSistema(CIDADE),
  ALUNO: gerarRotasSistema(ALUNO),
};

//criar rotas de forma dinâmica para os endpoints
//recurso, URLs, URI....
// concatenar = '/rest/sistema/cidade/buscar/:id'
