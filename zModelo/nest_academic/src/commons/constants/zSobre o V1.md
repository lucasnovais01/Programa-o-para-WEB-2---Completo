// TUTORIAL RÁPIDO: POR QUE USAR /v1/ NA API?

// Coisa interssante que achei na internet, achei legal colocar no sistema
// -------------------------------------------------

/**
 * =============================================
 * POR QUE USAR /v1/ NA ROTA DA API?
 * =============================================
 *
 * 1. CONTROLE DE VERSÃO (API Versioning)
 *    → Permite evoluir o sistema SEM quebrar clientes antigos.
 *
 *    Exemplo:
 *      v1 → POST /hospede/criar (campos: nome, cpf)
 *      v2 → POST /hospede/criar (campos: nome, cpf, celular*)
 *
 *      Cliente antigo continua usando /v1/ → NÃO QUEBRA
 *      Novo cliente usa /v2/ → usa novas regras
 *
 * 2. PADRÃO PROFISSIONAL
 *    → Usado por Google, GitHub, Stripe, AWS, etc.
 *    → Em aula: foco em CRUD simples (sem evolução)
 *    → Na vida real: APIs mudam → /v1/ é obrigatório
 *
 * 3. COMO FUNCIONA NO NESTJS
 *    const ROTA_SISTEMA = `rest/sistema/v1`;  // ← versão atual
 *    // Futuro: v2 → `rest/sistema/v2`
 *
 */