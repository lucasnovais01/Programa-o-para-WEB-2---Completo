/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../axios/config.axios";
import { API_FUNCIONARIO } from "../constants/funcionario.constants";
import type { Funcionario } from "../type/funcionario";

/**
 * ========================================================================
 * API FUNCIONARIO - Camada de Comunicação com Backend
 * ========================================================================
 *
 * Importante: Funcionário é especialização de HOSPEDE
 * - Endpoints use ID_USUARIO como identificador (PK é FK para HOSPEDE)
 * - Rotas: /rest/sistema/v1/3-funcionario/*
 *
 * Por que apiPutFuncionario é usado em Excluir.tsx?
 * - Não deletamos, apenas removemos a função (codigoFuncao = null)
 * - Isso transforma funcionário de volta em hóspede
 * - Mantém dados pessoais intactos
 * ========================================================================
 */

/**
 * GET - Listar todos os funcionários
 * Endpoint: GET /3-funcionario/listar
 * Retorno: { dados: Funcionario[] }
 */
export const apiGetFuncionarios = async (
  page: number = 1,
  pageSize: number = 5,
): Promise<any> => {
  console.log(
    "[apiGetFuncionarios] Chamando endpoint:",
    API_FUNCIONARIO.LISTAR,
    { page, pageSize }
  );
  const response = await http.get(API_FUNCIONARIO.LISTAR, {
    params: { page, pageSize },
  });
  console.log("[apiGetFuncionarios] Resposta recebida:", response);
  return response;
};

/**
 * GET - Buscar um funcionário pelo ID
 * Endpoint: GET /3-funcionario/por-id/{idUsuario}
 * Parâmetro: idUsuario (ID_USUARIO em COCAO_FUNCIONARIO)
 * Retorno: { dados: Funcionario }
 *
 * Uso: Consultar.tsx, Alterar.tsx, Excluir.tsx
 */
export const apiGetFuncionario = async (idUsuario: number): Promise<any> => {
  console.log("[apiGetFuncionario] Buscando funcionário ID:", idUsuario);
  const response = await http.get(`${API_FUNCIONARIO.POR_ID}/${idUsuario}`);
  return response;
};

/**
 * POST - Criar novo funcionário
 * Endpoint: POST /3-funcionario/criar
 * Payload: { idUsuario, nomeLogin, senha, codigoFuncao, dataContratacao, ativo }
 * Retorno: { dados: Funcionario (criado) }
 *
 * Importante:
 * - Recebe idUsuario (seleciona hospede existente na lista)
 * - codigoFuncao é STRING (lookup code, não ID)
 * - Trigger T19 atualiza TIPO=1 em COCAO_HOSPEDE automaticamente
 *
 * Uso: Criar.tsx
 */
export const apiPostFuncionario = async (
  funcionario: Funcionario
): Promise<any> => {
  console.log("[apiPostFuncionario] Criando funcionário:", funcionario);
  console.log("[apiPostFuncionario] Endpoint:", API_FUNCIONARIO.CRIAR);
  console.log(
    "[apiPostFuncionario] URL completa:",
    `http://localhost:8000/rest/sistema/v1${API_FUNCIONARIO.CRIAR}`
  );
  console.log(
    "[apiPostFuncionario] Payload enviado:",
    JSON.stringify(funcionario, null, 2)
  );

  try {
    const response = await http.post(API_FUNCIONARIO.CRIAR, funcionario);
    console.log("[apiPostFuncionario] Resposta:", response);
    console.log("[apiPostFuncionario] Status:", response?.status);
    console.log("[apiPostFuncionario] Data:", response?.data);
    return response;
  } catch (error: any) {
    console.error("[apiPostFuncionario] ERRO - Detalhes completos:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    console.error("[apiPostFuncionario] Full error object:", error);
    throw error;
  }
};

/**
 * PUT - Atualizar funcionário existente
 * Endpoint: PUT /3-funcionario/atualizar/{idUsuario}
 * Parâmetro URL: idUsuario (ID_USUARIO em COCAO_FUNCIONARIO)
 * Payload: { nomeLogin, senha, codigoFuncao, dataContratacao, ativo }
 * Retorno: { dados: Funcionario (atualizado) }
 *
 * CRÍTICO: O que NÃO deve ser enviado?
 * ❌ idUsuario (é PK, vem na URL)
 * ✓ Apenas campos que podem mudar: login, senha, função, data, ativo
 *
 * Uso:
 * - Alterar.tsx: atualiza login, senha, função, data de contratação
 * - Excluir.tsx: Remove função enviando codigoFuncao: null
 */
export const apiPutFuncionario = async (
  idUsuario: number,
  funcionario: Funcionario
): Promise<any> => {
  console.log("[apiPutFuncionario] Atualizando funcionário ID:", idUsuario);
  console.log(
    "[apiPutFuncionario] URL:",
    `${API_FUNCIONARIO.ATUALIZAR}/${idUsuario}`
  );
  console.log(
    "[apiPutFuncionario] Payload:",
    JSON.stringify(funcionario, null, 2)
  );
  const response = await http.put(
    `${API_FUNCIONARIO.ATUALIZAR}/${idUsuario}`,
    funcionario
  );
  console.log("[apiPutFuncionario] Resposta:", response);
  return response;
};

/**
 * DELETE - Remover função de funcionário (transforma em hóspede)
 * Endpoint: DELETE /3-funcionario/excluir/{idUsuario}
 * Parâmetro URL: idUsuario (ID_USUARIO em COCAO_FUNCIONARIO)
 * Retorno: Status de sucesso
 *
 * IMPORTANTE: Este endpoint remove o registro de COCAO_FUNCIONARIO
 * - Reclassifica o usuário em COCAO_HOSPEDE com TIPO = 0
 * - Mantém os dados pessoais em COCAO_HOSPEDE
 *
 * Uso: Excluir.tsx - ao clicar em "Remover Função"
 */
export const apiRemoveLoginFuncionario = async (
  idUsuario: number
): Promise<any> => {
  console.log(
    "[apiRemoveLoginFuncionario] Removendo login do funcionário ID:",
    idUsuario
  );
  console.log(
    "[apiRemoveLoginFuncionario] URL:",
    `${API_FUNCIONARIO.EXCLUIR}/${idUsuario}`
  );
  const response = await http.delete(`${API_FUNCIONARIO.EXCLUIR}/${idUsuario}`);
  console.log("[apiRemoveLoginFuncionario] Resposta:", response);
  return response;
};

/**
 * DELETE - Deletar funcionário (NÃO USADO em 3-funcionario!)
 * Endpoint: DELETE /3-funcionario/excluir/{idUsuario}
 *
 * IMPORTANTE: Em 3-funcionario NÃO usamos DELETE!
 * - Em vez de deletar, usamos apiRemoveLoginFuncionario que mantém dados
 * - Isso transforma funcionário em hóspede
 * - Mantém dados pessoais intactos
 * - Esta função existe por completude da API, mas Excluir.tsx não a usa
 *
 * Uso: Nenhum em 3-funcionario (Excluir.tsx usa apiRemoveLoginFuncionario)
 */
export const apiDeleteFuncionario = async (idUsuario: number): Promise<any> => {
  console.log("[apiDeleteFuncionario] Excluindo funcionário ID:", idUsuario);
  console.log(
    "[apiDeleteFuncionario] URL:",
    `${API_FUNCIONARIO.EXCLUIR}/${idUsuario}`
  );
  const response = await http.delete(`${API_FUNCIONARIO.EXCLUIR}/${idUsuario}`);
  console.log("[apiDeleteFuncionario] Resposta:", response);
  return response;
};
