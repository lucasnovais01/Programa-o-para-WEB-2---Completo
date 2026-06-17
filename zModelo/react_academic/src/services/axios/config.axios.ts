import axios from "axios"; // erro que está dando no pc da escola: Cannot find module 'axios' or its corresponding type declarations.
import { REST_CONFIG } from "../constants/sistema.constant";

const createLogger = () => ({
  request: (request: any) => {
    console.log('Request:', request);
    return request;
  },
  response: (response: any) => {
    console.log('Response:', response);
    return response;
  },
  error: (error: any) => {
    console.error('Erro na requisição:', {
      message: error?.message,
      config: error?.config,
      response: error?.response,
    });
    return Promise.reject(error);
  },
});

export const http = axios.create({
  baseURL: REST_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: false,
});

export const httpRoot = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: false,
});

const logger = createLogger();

http.interceptors.request.use(logger.request);
http.interceptors.response.use(logger.response, logger.error);

httpRoot.interceptors.request.use(logger.request);
httpRoot.interceptors.response.use(logger.response, logger.error);
