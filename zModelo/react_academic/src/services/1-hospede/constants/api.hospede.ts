/**
 * ============================================================
 * ROTAS DA API - Hóspede
 * ============================================================
 * 
 * PROPÓSITO:
 *   Definir as rotas CORRETAS para chamadas HTTP ao backend.
 *   SEM o prefixo "/sistema" porque axios já adiciona o baseURL.
 * 
 * DIFERENÇA vs url.ts:
 *   - url.ts: Gera rotas com "/sistema" para React Router SPA navigation
 *   - api.hospede.ts: Usa rotas SEM "/sistema" para chamadas HTTP
 * 
 * RESULTADO:
 *   axios baseURL ("http://localhost:8000/rest/sistema/v1")
 *   + rota desta arquivo ("/hospede/listar")
 *   = URL correta: "http://localhost:8000/rest/sistema/v1/hospede/listar" ✅
 * 
 * ============================================================
 */

export const API_HOSPEDE = {
  LISTAR: '/hospede/listar',
  POR_ID: '/hospede/buscar',
  CRIAR: '/hospede/criar',
  ATUALIZAR: '/hospede/alterar',
  EXCLUIR: '/hospede/excluir',
};
