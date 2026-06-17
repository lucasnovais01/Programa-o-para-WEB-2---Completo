import { httpRoot } from "../../services/axios/config.axios";

export const apiGetResources = async () => {
  // Aqui usamos httpRoot porque o endpoint /rest/resources não faz parte do
  // prefixo do sistema `/rest/sistema/v1`.
  //
  // O objeto `http` é usado para chamadas ao serviço do sistema com baseURL
  // `http://localhost:8000/rest/sistema/v1`. Já `httpRoot` aponta para a raiz
  // `http://localhost:8000`, então `httpRoot.get('/rest/resources')` acessa o
  // endpoint correto no backend.
  const response = await httpRoot.get('/rest/resources');
  return response;
};
