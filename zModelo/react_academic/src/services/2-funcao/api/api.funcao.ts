import type { AxiosResponse } from "axios";
import { http } from "../../axios/config.axios";
import { API_FUNCAO } from "../constants/funcao.constants";
import type { Funcao } from "../type/funcao";

type GetFuncoesResponse = {
  dados?:
    | {
        content: Funcao[];
        totalElements?: number;
        totalPages?: number;
      }
    | Funcao[];
  _link?: Record<string, unknown>;
};

export const apiGetFuncoes = async (
  page: number = 1,
  pageSize: number = 5,
): Promise<AxiosResponse<GetFuncoesResponse>> => {
  console.log('[apiGetFuncoes] Chamando endpoint:', API_FUNCAO.LISTAR, {
    page,
    pageSize,
  });
  const response = await http.get<GetFuncoesResponse>(API_FUNCAO.LISTAR, {
    params: { page, pageSize },
  });
  console.log('[apiGetFuncoes] Resposta recebida:', response);
  return response;
};

type GetFuncaoResponse = {
  dados: Funcao;
};

export const apiGetFuncao = async (
  codigoFuncao: number,
): Promise<AxiosResponse<GetFuncaoResponse>> => {
  console.log('[apiGetFuncao] Buscando função código:', codigoFuncao);
  const response = await http.get<GetFuncaoResponse>(`${API_FUNCAO.POR_ID}/${codigoFuncao}`);
  return response;
};

export const apiPostFuncao = async (
  funcao: Funcao,
): Promise<AxiosResponse<unknown>> => {
  console.log('[apiPostFuncao] Criando função:', funcao);
  console.log('[apiPostFuncao] Endpoint:', API_FUNCAO.CRIAR);
  console.log(
    '[apiPostFuncao] URL completa:',
    `http://localhost:8000/rest/sistema/v1${API_FUNCAO.CRIAR}`,
  );
  console.log('[apiPostFuncao] Payload enviado:', JSON.stringify(funcao, null, 2));

  try {
    const response = await http.post(API_FUNCAO.CRIAR, funcao);
    console.log('[apiPostFuncao] Resposta:', response);
    console.log('[apiPostFuncao] Status:', response?.status);
    console.log('[apiPostFuncao] Data:', response?.data);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[apiPostFuncao] ERRO - Detalhes completos:', {
        message: error.message,
      });
    } else {
      console.error('[apiPostFuncao] ERRO desconhecido:', error);
    }
    throw error;
  }
};

export const apiPutFuncao = async (
  codigoFuncao: number,
  funcao: Funcao,
): Promise<AxiosResponse<unknown>> => {
  console.log('[apiPutFuncao] Atualizando função código:', codigoFuncao);
  console.log('[apiPutFuncao] URL:', `${API_FUNCAO.ATUALIZAR}/${codigoFuncao}`);
  const response = await http.put(
    `${API_FUNCAO.ATUALIZAR}/${codigoFuncao}`,
    funcao,
  );
  console.log('[apiPutFuncao] Resposta:', response);
  return response;
};

export const apiDeleteFuncao = async (
  codigoFuncao: number,
): Promise<AxiosResponse<unknown>> => {
  console.log('[apiDeleteFuncao] Excluindo função código:', codigoFuncao);
  console.log('[apiDeleteFuncao] URL:', `${API_FUNCAO.EXCLUIR}/${codigoFuncao}`);
  const response = await http.delete(`${API_FUNCAO.EXCLUIR}/${codigoFuncao}`);
  console.log('[apiDeleteFuncao] Resposta:', response);
  return response;
};

