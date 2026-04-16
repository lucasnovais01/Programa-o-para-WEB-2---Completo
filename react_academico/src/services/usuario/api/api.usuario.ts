import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';
import type { Usuario } from '../type/Usuario';

export interface SearchParams {
  page?: number;
  pageSize?: number;
  props?: string;
  order?: string;
  search?: string;
}

export const apiGetUsuarios = async (params: SearchParams) => {
  const response = await http.get(ROTA.USUARIO.LISTAR, {
    params,
  });
  return response;
};

export const apiGetUsuario = async (idUsuario: string) => {
  const response = await http.get(`${ROTA.USUARIO.POR_ID}/${idUsuario}`);
  return response;
};

export const apiPostUsuario = async (usuario: Usuario) => {
  const response = await http.post(ROTA.USUARIO.CRIAR, usuario);
};

export const apiPutUsuario = async (idUsuario: string, usuario: Usuario) => {
  const response = await http.put(
    `${ROTA.USUARIO.ATUALIZAR}/${idUsuario}`,
    usuario,
  );
};

export const apiDeleteUsuario = async (idUsuario: string) => {
  const response = await http.delete(`${ROTA.USUARIO.EXCLUIR}/${idUsuario}`);
};
