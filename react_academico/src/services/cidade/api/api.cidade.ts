import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';
import type { Cidade } from '../type/Cidade';

export interface SearchParams {
  page?: number;
  pageSize?: number;
  props?: string;
  order?: string;
  search?: string;
}

export const apiGetCidades = async (url: string, params: SearchParams) => {
  const response = await http.get(url, {
    params,
  });
  return response;
};

export const apiGetCidade = async (idCidade: string) => {
  const response = await http.get(`${ROTA.CIDADE.POR_ID}/${idCidade}`);
  return response;
};

export const apiPostCidade = async (cidade: Cidade) => {
  const response = await http.post(ROTA.CIDADE.CRIAR, cidade);
};

export const apiPutCidade = async (idCidade: string, cidade: Cidade, url: string) => {
  const response = await http.put(
    `${url}/${idCidade}`,
    cidade,
  );
};

export const apiDeleteCidade = async (idCidade: string) => {
  const response = await http.delete(`${ROTA.CIDADE.EXCLUIR}/${idCidade}`);
};
