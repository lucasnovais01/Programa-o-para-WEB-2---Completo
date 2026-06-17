/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../axios/config.axios";
import { API_HOSPEDE } from "../constants/api.hospede"; // Importa as rotas corretas da API
                                                        // em vez de usar ROTA que tem /sistema
                                                        // era isto que causava o problema 404
import type { Hospede } from "../type/hospede";

/*
 * ============================================================
 * DOCUMENTAÇÃO: api.hospede.ts
 * ============================================================
 * 
 * PROPÓSITO:
 *   Centralizar todas as chamadas HTTP para o backend relacionadas a Hóspede.
 * 
 * FLUXO:
 *   1. apiGetHospedes() é chamado no componente Listar.tsx
 *   2. Usa http.get() que possui baseURL configurado
 *   3. ROTA.HOSPEDE.LISTAR fornece o endpoint relativo
 *   4. axios monta a URL completa: baseURL + endpoint
 * 
 * PROBLEMA ATUAL (11/11/2025):
 *   - ROTA.HOSPEDE.LISTAR retorna "/sistema/hospede/listar"
 *   - baseURL é "http://localhost:8000/rest/sistema/v1"
 *   - URL final: "http://localhost:8000/rest/sistema/v1/sistema/hospede/listar"
 *   - Backend espera: "http://localhost:8000/rest/sistema/v1/hospede/listar"
 * 
 * Por que ocorre?
 *   - O arquivo url.ts foi criado para React Router (que precisa de /sistema)
 *   - As APIs usam a mesma rota, mas não deveria ter /sistema
 *   - Solução: Criar um mapeamento separado para APIs ou remover /sistema aqui
 * 
 * ============================================================
 */

// Lista todos os hóspedes (sem filtro de tipo)
export const apiGetHospedes = async (
  page: number = 1,
  pageSize: number = 5,
  props: string = 'idUsuario',
  order: 'ASC' | 'DESC' = 'ASC',
  searchTerm?: string,
): Promise<any> => {
  console.log('[apiGetHospedes] Chamando endpoint:', API_HOSPEDE.LISTAR);
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('pageSize', String(pageSize));
  params.append('props', props);
  params.append('order', order);
  if (searchTerm) {
    params.append('searchTerm', searchTerm);
  }

  const url = `${API_HOSPEDE.LISTAR}?${params.toString()}`;
  console.log('[apiGetHospedes] URL final:', url);
  const response = await http.get(url);
  console.log('[apiGetHospedes] Resposta recebida:', response);
  return response;
};

// Busca um hóspede por ID
export const apiGetHospede = async (idUsuario: number): Promise<any> => {
  console.log('[apiGetHospede] Buscando hóspede ID:', idUsuario);
  // const response = await http.get(`${ROTA.HOSPEDE.POR_ID}/${idUsuario}`);
  const response = await http.get(`${API_HOSPEDE.POR_ID}/${idUsuario}`);
  return response;
};

// Cria um novo hóspede
export const apiPostHospede = async (hospede: Hospede): Promise<any> => {
  console.log('[apiPostHospede] Criando hóspede:', hospede);
  console.log('[apiPostHospede] Endpoint:', API_HOSPEDE.CRIAR);
  console.log('[apiPostHospede] URL completa:', `http://localhost:8000/rest/sistema/v1${API_HOSPEDE.CRIAR}`);
  console.log('[apiPostHospede] Payload enviado:', JSON.stringify(hospede, null, 2));
  
  try {
    // const response = await http.post(ROTA.HOSPEDE.CRIAR, hospede);
    const response = await http.post(API_HOSPEDE.CRIAR, hospede);
    console.log('[apiPostHospede] Resposta:', response);
    return response;
  } catch (error: any) {
    console.error('[apiPostHospede] Erro detalhado:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });
    throw error;
  }
};

// Atualiza um hóspede existente
export const apiPutHospede = async (idUsuario: number, hospede: Hospede): Promise<any> => {
  console.log('[apiPutHospede] Atualizando hóspede ID:', idUsuario);
  console.log('[apiPutHospede] URL:', `${API_HOSPEDE.ATUALIZAR}/${idUsuario}`);
//  const response = await http.put(`${ROTA.HOSPEDE.ATUALIZAR}/${idUsuario}`, hospede);
  const response = await http.put(`${API_HOSPEDE.ATUALIZAR}/${idUsuario}`, hospede);
  console.log('[apiPutHospede] Resposta:', response);
  return response;
};

// Exclui um hóspede
export const apiDeleteHospede = async (idUsuario: number): Promise<any> => {
  console.log('[apiDeleteHospede] Excluindo hóspede ID:', idUsuario);
  console.log('[apiDeleteHospede] URL:', `${API_HOSPEDE.EXCLUIR}/${idUsuario}`);
  // const response = await http.delete(`${ROTA.HOSPEDE.EXCLUIR}/${idUsuario}`);
  const response = await http.delete(`${API_HOSPEDE.EXCLUIR}/${idUsuario}`);
  console.log('[apiDeleteHospede] Resposta:', response);
  return response;
};