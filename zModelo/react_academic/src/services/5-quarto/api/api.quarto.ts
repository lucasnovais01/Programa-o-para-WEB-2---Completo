import type { AxiosResponse } from "axios";
import { http } from "../../axios/config.axios";
import { API_QUARTO } from "../constants/quarto.constants";
import type { Quarto } from "../type/quarto";

type GetQuartosResponse = {
  dados?:
    | {
        content: Quarto[];
        totalElements?: number;
        totalPages?: number;
      }
    | Quarto[];
};

type GetQuartoResponse = {
  dados?: Quarto;
};

export const apiGetQuartos = async (
  page: number = 1,
  pageSize: number = 5,
): Promise<AxiosResponse<GetQuartosResponse>> => {
  console.log("[apiGetQuartos] Chamando endpoint:", API_QUARTO.LISTAR, {
    page,
    pageSize,
  });
  const response = await http.get<GetQuartosResponse>(API_QUARTO.LISTAR, {
    params: { page, pageSize },
  });
  console.log("[apiGetQuartos] Resposta recebida:", response);
  return response;
};

export const apiGetQuarto = async (
  idQuarto: number,
): Promise<AxiosResponse<GetQuartoResponse>> => {
  console.log("[apiGetQuarto] Buscando quarto ID:", idQuarto);
  const response = await http.get<GetQuartoResponse>(`${API_QUARTO.POR_ID}/${idQuarto}`);
  return response;
};

export const apiPostQuarto = async (quarto: Quarto): Promise<AxiosResponse<unknown>> => {
  console.log("[apiPostQuarto] Criando quarto:", quarto);
  console.log("[apiPostQuarto] Endpoint:", API_QUARTO.CRIAR);
  console.log(
    "[apiPostQuarto] URL completa:",
    `http://localhost:8000/rest/sistema/v1${API_QUARTO.CRIAR}`
  );
  console.log(
    "[apiPostQuarto] Payload enviado:",
    JSON.stringify(quarto, null, 2)
  );

  try {
    const response = await http.post<unknown>(API_QUARTO.CRIAR, quarto);
    console.log("[apiPostQuarto] Resposta:", response);
    console.log("[apiPostQuarto] Status:", response?.status);
    console.log("[apiPostQuarto] Data:", response?.data);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[apiPostQuarto] ERRO - Detalhes completos:", {
        message: error.message,
      });
    } else {
      console.error("[apiPostQuarto] ERRO desconhecido:", error);
    }
    throw error;
  }
};

export const apiPutQuarto = async (
  idQuarto: number,
  quarto: Quarto
): Promise<AxiosResponse<unknown>> => {
  console.log("[apiPutQuarto] Atualizando quarto ID:", idQuarto);
  console.log("[apiPutQuarto] URL:", `${API_QUARTO.ATUALIZAR}/${idQuarto}`);
  const response = await http.put<unknown>(
    `${API_QUARTO.ATUALIZAR}/${idQuarto}`,
    quarto
  );
  console.log("[apiPutQuarto] Resposta:", response);
  return response;
};

export const apiDeleteQuarto = async (idQuarto: number): Promise<AxiosResponse<unknown>> => {
  console.log("[apiDeleteQuarto] Excluindo quarto ID:", idQuarto);
  console.log("[apiDeleteQuarto] URL:", `${API_QUARTO.EXCLUIR}/${idQuarto}`);
  const response = await http.delete<unknown>(`${API_QUARTO.EXCLUIR}/${idQuarto}`);
  console.log("[apiDeleteQuarto] Resposta:", response);
  return response;
};
