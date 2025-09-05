// import { Cidade } from "src/cidade/entity/cidade.entity";
import { ALUNO, CIDADE, PROFESSOR, USUARIO } from './constants.sistema';

export const SERVIDOR = 'http://localhost:8000';
export const CLIENTE = 'http://localhost:3000';

const ROTA_SISTEMA = 'rest/sistema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ROTA_AUTH = 'rest/auth';

// Padrões do sistema:

const LIST = 'listar';
const CREATE = 'criar';
const BY_ID = 'buscar';
const UPDATE = 'alterar';
const DELETE = 'excluir';

// /rest/sistema/cidade

function gerarRotasSistema(entity: string) {
  const base = `/${ROTA_SISTEMA}/${entity}`; // que é o rota sistema
  return {
    BASE: base,
    LIST: `/${LIST}`,
    CREATE: `/${CREATE}`,
    BY_ID: `/${BY_ID}/:id`, // Os dois pontos está falando pro nestjs que é um parâmetro de URL
    UPDATE: `/${UPDATE}/:id`,
    DELETE: `/${DELETE}/:id`,
  };
}

// /rest/sistema/cidade/listar

export const ROTA = {
  USUARIO: gerarRotasSistema(USUARIO),
  PROFESSOR: gerarRotasSistema(PROFESSOR),
  CIDADE: gerarRotasSistema(CIDADE),
  ALUNO: gerarRotasSistema(ALUNO),
};

// Criar rotas de forma dinâmica para os endpoints
// recurso, URL, URI...
// E como funciona: Ela vai concatenar = '/rest/sistema/cidade/buscar/:id'

// http:localhost:8000/v1/cidade
// /rest/auth
