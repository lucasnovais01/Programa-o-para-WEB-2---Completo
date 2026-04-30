import axios from "axios";
import { REST_CONFIG } from "../constant/sistema.constants";

export const http = axios.create({
  baseURL: REST_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// VAI PRECISAR DOS INTERCEPTOR para funcionar com o TOKEN


/*
#### 3.1. Configuração do Axios para Enviar Token

Configure o axios para incluir o token em todas as requisições:

// react_academico/src/services/axios/config.axios.ts

import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8000/rest',
});

// Interceptor para adicionar o token em todas as requisições

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('accessToken');
      window.location.href = '/sistema/auth/login';
    }
    return Promise.reject(error);
  }
);


*/