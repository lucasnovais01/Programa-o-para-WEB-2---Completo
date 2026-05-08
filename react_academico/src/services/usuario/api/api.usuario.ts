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

// GET listar — url vem do getEndpoint('usuario') sem id
export const apiGetUsuarios = async (
  url: string,
  params: SearchParams,
): Promise<PaginatedResponse<Usuario>> => {
  const response = await http.get<PaginatedResponse<Usuario>>(url, { params });
  return response.data;
};

// GET buscar um — url vem do ROTA.USUARIO.POR_ID
export const apiGetUsuario = async (idUsuario: string) => {
  const response = await http.get(`${ROTA.USUARIO.POR_ID}/${idUsuario}`);
  return response;
};

// POST criar — url vem do ROTA.USUARIO.CRIAR
export const apiPostUsuario = async (usuario: Usuario) => {
  const response = await http.post(ROTA.USUARIO.CRIAR, usuario);
  return response; // ✅ retorna response para o hook saber se deu certo
};

// PUT alterar — url vem do getEndpoint('usuario', id)
export const apiPutUsuario = async (idUsuario: string, usuario: Usuario, url: string) => {
  const response = await http.put(`${url}/${idUsuario}`, usuario);
  return response;
};

// DELETE excluir — url vem do ROTA.USUARIO.EXCLUIR
export const apiDeleteUsuario = async (idUsuario: string) => {
  const response = await http.delete(`${ROTA.USUARIO.EXCLUIR}/${idUsuario}`);
  return response;
};