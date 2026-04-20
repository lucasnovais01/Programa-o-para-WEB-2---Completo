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
// ESTAVA DANDO ERRO DE TIPO, POR ISSO ADICIONEI O RETORNO DA FUNÇÃO COMO PROMISE<PaginatedResponse<Usuario>>
/*
export const apiGetUsuarios = async (params: SearchParams) => {
  const response = await http.get(ROTA.USUARIO.LISTAR, {
    params,
  });
  return response.data;
};
*/
export const apiGetUsuarios = async (
  params: SearchParams,
): Promise<PaginatedResponse<Usuario>> => {
  const response = await http.get<PaginatedResponse<Usuario>>(
    ROTA.USUARIO.LISTAR,
    {
      params,
    },
  );
  return response.data;
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
