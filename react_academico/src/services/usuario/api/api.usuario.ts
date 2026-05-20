import { http } from '../../axios/config.axios';
import type { PaginatedResponse, Usuario } from '../type/Usuario';
// import { ROTA } from '../../commons/constants/url.sistema'; // Não irei mais usar este import pois as URLs estão hardcoded aqui mesmo, para facilitar a leitura e evitar confusão com o backend. Se fosse um projeto maior, aí sim faria sentido centralizar as URLs em um arquivo de constantes.

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

// GET buscar um — url vem do ROTA.USUARIO.POR_ID, no modelo do professor
const BASE_URL = '/rest/sistema/usuario';

// GET buscar um — URL da API backend
export const apiGetUsuario = async (idUsuario: string) => {

// const response = await http.get(`${ROTA.USUARIO.POR_ID}/${idUsuario}`); - No modelo do professor
  const response = await http.get(`${BASE_URL}/buscar/${idUsuario}`);
  return response;
};

// POST criar — URL da API backend
export const apiPostUsuario = async (usuario: Usuario) => {

// const response = await http.post(`${ROTA.USUARIO.CRIAR}`, usuario); - No modelo do professor
  const response = await http.post(`${BASE_URL}/criar`, usuario);
  return response; // ✅ retorna response para o hook saber se deu certo
};

// PUT alterar — url vem do getEndpoint('usuario') com id, no modelo do professor
// export const apiPutUsuario = async (idUsuario: string, usuario: Usuario) => {
//   const response = await http.put(`${ROTA.USUARIO.ALTERAR}/${idUsuario}`, usuario);
//   return response;
// };
// PUT alterar — URL da API backend
export const apiPutUsuario = async (idUsuario: string, usuario: Usuario) => {
  const response = await http.put(`${BASE_URL}/alterar/${idUsuario}`, usuario);
  return response;
};

// DELETE excluir -- url vem do ROTA.USUARIO.EXCLUIR, no modelo do professor
// export const apiDeleteUsuario = async (idUsuario: string) => {
//   const response = await http.delete(`${ROTA.USUARIO.EXCLUIR}/${idUsuario}`);
// DELETE excluir — URL da API backend
export const apiDeleteUsuario = async (idUsuario: string) => {
  const response = await http.delete(`${BASE_URL}/excluir/${idUsuario}`);
  return response;
};