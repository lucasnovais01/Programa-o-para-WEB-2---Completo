import { http } from "../../axios/config.axios";
import { ROTA } from "../../router/url";
import type { Cidade } from "../../../type/cidade";

// Para receber os dados do controller findall do @query isto é o order, search, etc..

export type SearchParam = {
  page?: number;
  pageSize?: number;
  props?: string;
  order?: string;
  search?: string;
}

export const apiGetCidades = async (
  params : SearchParam
) => {
  const response = await http.get(ROTA.CIDADE.LISTAR, {
    params
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

export const apiPutCidade = async (idCidade: string, cidade: Cidade) => {
  const response = await http.put(
    `${ROTA.CIDADE.ATUALIZAR}/${idCidade}`,
    cidade,
  );
};

export const apiDeleteCidade = async (idCidade: string) => {
  const response = await http.delete(`${ROTA.CIDADE.EXCLUIR}/${idCidade}`);
};
