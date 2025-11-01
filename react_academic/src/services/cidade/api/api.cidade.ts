import { http } from "../../axios/config.axios"
import { ROTA } from "../../router/url"

export const apiGetCidades = async () => {
  const response = await http.get(ROTA.CIDADE.LISTAR)

  return response;
};