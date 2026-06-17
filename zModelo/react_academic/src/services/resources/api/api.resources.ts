
// api.resources.ts é responsável por centralizar as chamadas HTTP para o backend 
// relacionadas a recursos genéricos da aplicação, como endpoints e métodos disponíveis. 
// Ele serve como uma camada de abstração entre os componentes da interface do usuário 
// e as APIs do backend, facilitando a manutenção e a organização do código.

// Ele pode incluir funções para obter a lista de recursos, buscar detalhes de um 
// recurso específico, ou até mesmo criar, atualizar ou deletar recursos, 
// dependendo das necessidades da aplicação. O objetivo é ter um local único 
// onde todas as interações com os recursos do backend sejam gerenciadas, 
// promovendo a reutilização de código e a consistência nas chamadas à API.
/*

// Não está implementado ainda no código, mas será no futuro, precisa de conserto

import { http } from '../../axios/config.axios';

export const apiGetResources = async () => {
  const response = await http.get('/rest/resources');
  return response;
};

*/