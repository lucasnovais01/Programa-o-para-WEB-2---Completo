import { CIDADE } from "../cidade/constants/cidade.constants";
import { USUARIO } from "../usuario/constants/usuario.constants";

import { AUTH } from "../auth/constants/auth.constants";

import Login from "../../views/auth/Login";

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

    LOGIN: `/${base}/${Login}}`
  };
}

export const ROTA = {
  CIDADE: gerarRotaSistema(CIDADE.ALIAS),
  USUARIO: gerarRotaSistema(USUARIO.ALIAS),
  AUTH: gerarRotaSistema(AUTH.ALIAS),
};
