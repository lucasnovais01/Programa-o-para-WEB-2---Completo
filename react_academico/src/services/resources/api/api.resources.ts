import { http } from '../../axios/config.axios';

export const apiGetResources = async () => {
  const response = await http.get('/rest/resources');
  return response;
};
