// O arquivo api.ts não está servindo pra mais nada, mas antes ele centralizava

// a configuração do Axios para evitar duplicação de código em vários arquivos.
// Mantive o arquivo com uma configuração básica atualizada para referência futura,
// caso seja necessário reativar o uso do Axios centralizado na aplicação React.

// =============================================================================
// HISTÓRICO DE ALTERAÇÕES - 06/11/2025
// =============================================================================
// MUDANÇA: Alteração da porta da API de 3000 para 8000
// MOTIVO: Erro de conexão recusada (ERR_CONNECTION_REFUSED) na porta 3000
// CONTEXTO: O servidor NestJS está configurado para rodar na porta 8000 (main.ts)
// =============================================================================

import axios from 'axios';

// Configuração ANTIGA (comentada para referência)
/*
export const api = axios.create({
    baseURL: 'http://localhost:3000',  // [REMOVIDO] Porta incorreta
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});
*/

// NOVA Configuração 3.0 (simplificada para resolver CORS)
export const api = axios.create({
    // Atualizado para porta 8000 onde o NestJS está rodando
    baseURL: 'http://localhost:8000/rest/sistema/v1',
    
    // Timeout padrão
    timeout: 5000,
    
    // Headers mínimos necessários
    headers: {
        'Content-Type': 'application/json'
    },

    // Desativado credentials pois não estamos usando auth ainda
    withCredentials: false
});

// 5. INTERCEPTORS (opcional):
// Permite processar requisições/respostas globalmente

// Interceptors ANTIGOS (comentados para referência)
/*
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
*/

// NOVOS Interceptors com logging e tratamento de erro melhorado
api.interceptors.request.use(
    (config) => {
        // Log da requisição para debug
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // Log da resposta para debug
        console.log(`[API Response] ${response.status}`, {
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        // Log detalhado do erro
        console.error('[API Error]', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers,
                data: error.config?.data
            }
        });
        return Promise.reject(error);
    }
);
export default api;


// ============================================================
// Arquivo: api.ts - Configuração Central do Axios
// ============================================================
// 1. OBJETIVO:
// Este arquivo centraliza a configuração do cliente HTTP Axios para toda a aplicação,
// evitando duplicação de código e mantendo consistência nas chamadas à API.

// 2. BENEFÍCIOS:
// - Manutenção simplificada: alterações na URL base ou configurações afetam toda a aplicação
// - DRY (Don't Repeat Yourself): evita repetir configurações do Axios em múltiplos arquivos
// - Consistência: garante que todas as chamadas à API usem as mesmas configurações
// - Interceptors: permite adicionar handlers globais para requisições/respostas

// 3. POR QUE USAR:
// Ao invés de configurar o Axios em cada componente, centralizamos aqui:
// - Facilita mudanças de ambiente (dev, homolog, prod)
// - Permite adicionar headers padrão (ex: tokens)
// - Simplifica o tratamento de erros global
// - Melhora a organização do código



// 6. COMO USAR:
// Em outros arquivos, importe e use:
// import { api } from '../services/axios/api';
// api.get('/rota').then(response => {...});

// 7. OBSERVAÇÕES IMPORTANTES:
// - Mantenha este arquivo o mais simples possível
// - Documente alterações importantes
// - Configure variáveis de ambiente (.env) para URLs diferentes
// - Considere adicionar retry logic para requisições falhas
// - Implemente tratamento de erros adequado

// 8. SEGURANÇA:
// - Nunca exponha credenciais neste arquivo
// - Use variáveis de ambiente para dados sensíveis
// - Implemente renovação de tokens quando necessário
// - Valide certificados SSL em produção