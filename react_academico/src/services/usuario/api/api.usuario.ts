import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';
import type { PaginatedResponse, Usuario } from '../type/Usuario';

export interface SearchParams {
  page?: number;
  pageSize?: number;
  props?: string;
  order?: string;
  search?: string;
}

// ✅ GET listar — url vem do getEndpoint('usuario') sem id
export const apiGetUsuarios = async (
  url: string,
  params: SearchParams,
): Promise<PaginatedResponse<Usuario>> => {
  const response = await http.get<PaginatedResponse<Usuario>>(url, { params });
  return response.data;
};

// ✅ GET buscar um — url do frontend ainda funciona pois vai para o backend via baseURL
// ROTA.USUARIO.POR_ID = /sistema/usuario/buscar — ERRADO igual ao listar
// Corrigido: url vem do getEndpoint('usuario', id)
export const apiGetUsuario = async (url: string, idUsuario: string) => {
  const response = await http.get(`${url}/${idUsuario}`);
  return response;
};

// ✅ POST criar — url vem do getEndpoint('usuario') sem id
// Motivo: ROTA.USUARIO.CRIAR = /sistema/usuario/criar (URL do frontend, não do backend)
export const apiPostUsuario = async (url: string, usuario: Usuario) => {
  const response = await http.post(url, usuario);
  return response; // ✅ retorna response para o hook saber se deu certo
};

// ✅ PUT alterar — url vem do getEndpoint('usuario', id)
export const apiPutUsuario = async (url: string, idUsuario: string, usuario: Usuario) => {
  const response = await http.put(`${url}/${idUsuario}`, usuario);
  return response;
};

// ✅ DELETE excluir — url vem do getEndpoint('usuario', id)
export const apiDeleteUsuario = async (url: string, idUsuario: string) => {
  const response = await http.delete(`${url}/${idUsuario}`);
  return response;
};