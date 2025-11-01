import { http } from "../../axios/config.axios"
import { ROTA } from "../../router/url"
import type { Cidade } from "../type/cidade";

export const apiGetCidades = async () => {
  const response = await http.get(ROTA.CIDADE.LISTAR)
  return response;
};


export const apiGetCidade = async ( idCidade: string) => {
  const response = await http.get(`${ROTA.CIDADE.POR_ID}/${idCidade}`)
  return response;
};


export const apiPostCidade = async (cidade: Cidade) => {
  const response = await http.post(ROTA.CIDADE.CRIAR, cidade);
};

