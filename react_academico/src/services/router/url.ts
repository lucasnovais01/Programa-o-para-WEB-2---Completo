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
/*
const RECUPERAR = `recuperar`;
const RESETAR = `resetar`;
const CONFIRMAREMAIL = `confirmarEmail`;
*/

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
    /*
    RECUPERAR: `/${base}/${RECUPERAR}}`,
    RESETAR: `/${base}/${RESETAR}}`,
    CONFIRMAREMAIL: `/${base}/${CONFIRMAREMAIL}
    */
  };
}
// AUTH tem estrutura própria, só tem LOGIN, POR ISTO ESTAVA DANDO ERRO, POIS TENTAVA GERAR ROTAS QUE NÃO EXISTEM PARA AUTH
function gerarRotaAuth(entity: string) {
  const base = `${ROTA_SISTEMA}/${entity}`;
  return {
    LOGIN: `/${base}/login`,
    /*
    RECUPERAR: `/${base}/recuperar`,
    RESETAR: `/${base}/resetar`,
    CONFIRMAREMAIL: `/${base}/confirmarEmail`,
    */
  };
}

// Adicionado DASHBOARD dentro do const ROTA para ficar mais organizado, pois ele é uma rota do sistema, mas não pertence a nenhuma entidade específica como CIDADE ou USUARIO.
export const ROTA = {
  DASHBOARD,
  CIDADE:  gerarRotaSistema(CIDADE.ALIAS),
  USUARIO: gerarRotaSistema(USUARIO.ALIAS),

  AUTH:    gerarRotaAuth(AUTH.ALIAS),  // AUTH tem estrutura própria — só tem LOGIN
// NOVAS ROTAS DE RECUPERAÇÃO
  RECUPERAR_SENHA: {
    SOLICITAR: '/sistema/auth/recuperar',     // forgot-password
    RESETAR: '/sistema/auth/resetar',         // reset-password?token=xxx
  },
};
