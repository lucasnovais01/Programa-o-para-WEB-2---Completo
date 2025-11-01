import axios from "axios";
import { REST_CONFIG } from "../constants/sistema.constant";


export const http = axios.create({
  baseURL: REST_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-type":"application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});