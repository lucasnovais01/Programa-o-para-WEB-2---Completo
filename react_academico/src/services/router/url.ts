import { CIDADE } from "../cidade/constants/cidade.constants";
import { USUARIO } from "../usuario/constants/usuario.constants";

import { AUTH } from "../auth/constants/auth.constants";

//
const ROTA_SISTEMA = "sistema";
export const DASHBOARD = `/${ROTA_SISTEMA}/dashboard`;

const LISTAR = `listar`;
const CRIAR = "criar";
const POR_ID = `buscar`;
const ATUALIZAR = `alterar`;
const EXCLUIR = `excluir`;

const LOGIN = `login`;

function gerarRotaSistema(entity: string) {
  const base = `${ROTA_SISTEMA}/${entity}`;
  return {
    LISTAR: `/${base}/${LISTAR}`,
    CRIAR: `/${base}/${CRIAR}`,
    POR_ID: `/${base}/${POR_ID}`,
    ATUALIZAR: `/${base}/${ATUALIZAR}`,
    EXCLUIR: `/${base}/${EXCLUIR}`,

    // Tentando de tudo para funcionar

    LOGIN: `/${base}/${LOGIN}}` // TEM QUE ESTAR COM LETRA MAIUSCULA
  };
}
// AUTH tem estrutura própria, só tem LOGIN, POR ISTO ESTAVA DANDO ERRO, POIS TENTAVA GERAR ROTAS QUE NÃO EXISTEM PARA AUTH
function gerarRotaAuth(entity: string) {
  const base = `${ROTA_SISTEMA}/${entity}`;
  return {
    LOGIN: `/${base}/login`,
  };
}

export const ROTA = {
  CIDADE:  gerarRotaSistema(CIDADE.ALIAS),
  USUARIO: gerarRotaSistema(USUARIO.ALIAS),

  AUTH:    gerarRotaAuth(AUTH.ALIAS),  // AUTH tem estrutura própria — só tem LOGIN
};
