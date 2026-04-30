/* No modelo do meu professor está assim, 

import { http } from "../../axios/config.axios";

export const apiGetResources = async () => {
  const response = await http.get('/rest/resources');
  return response;
};
*/

import { http } from "../../axios/config.axios";

export const apiGetResources = async () => {
  const response = await http.get('/resources'); // ✅ sem /rest/
  return response;
};


/*
Tem que fazer alguma mudança aqui também

pois mudamos o react_academico\src\services\constant\sistema.constants.ts

então pra dar certo, colocaremos o /rest/ aqui


*/