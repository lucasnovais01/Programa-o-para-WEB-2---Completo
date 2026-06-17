import { Expose } from 'class-transformer';

/**
 * DTO de resposta para Hospede.
 * Define os campos expostos ao cliente após serialização.
 *
 * - Baseado na entidade COCAO_HOSPEDE.
 * - Usa @Expose() para controlar o que é enviado na resposta JSON.
 * - Inclui timestamps de BaseEntity (createdAt, updatedAt).
 *
 * Observações:
 * - Campos opcionais como rg, email, telefone podem ser undefined/null.
 * - Datas (dataNascimento, createdAt, updatedAt) são serializadas como strings ISO.
 * - Não expõe dados sensíveis (ex.: senhas não existem aqui).
 */

/*
 * Diferenças em relação ao modelo antigo ('CidadeResponse'):
 * 1. Mais campos: Antigo tinha apenas 3 (id, cod, nome). Aqui mapeamos todos os campos do DDL, incluindo dates, numbers e opcionais, para um DTO completo.
 * 2. Inicializações: Mantidas para defaults em memória (ex.: strings vazias, dates novas, numbers 0/1), similar ao antigo, mas aplicadas consistentemente a obrigatórios e defaults.
 * 3. Tipos opcionais ('?'): Adicionados para campos nullable (ex.: rg?), alinhando ao DDL e entity, ausente no antigo (mais simples).
 * 4. Timestamps: Incluídos (createdAt, updatedAt) pois herdamos de BaseEntity; antigo não tinha.
 */

export class HospedeResponse {
  @Expose()
  // ID gerado pelo banco.
  idUsuario?: number;

  @Expose()
  // Nome completo.
  nomeHospede: string = '';

  @Expose()
  // CPF único.
  cpf: string = '';

  @Expose()
  // RG opcional.
  rg?: string;

  @Expose()
  // Sexo: 'M', 'F' ou 'O'.
  sexo: string = '';

  @Expose()
  // Data de nascimento.
  dataNascimento: Date = new Date();

  @Expose()
  // Email opcional.
  email?: string;

  @Expose()
  // Telefone opcional.
  telefone?: string;

  @Expose()
  // Tipo: 0 = Hóspede, 1 = Funcionário.
  tipo: number = 0;

  @Expose()
  // Ativo: 1 = Sim, 0 = Não.
  ativo: number = 1;

  @Expose()
  // Timestamp de criação.
  createdAt: Date = new Date();

  @Expose()
  // Timestamp de atualização.
  updatedAt: Date = new Date();
}

/**
 * ==============================================================
 * TUTORIAL: hospede.response.ts
 * ==============================================================
 * O que é?
 *   - DTO (Data Transfer Object) para respostas da API.
 *   - Define a estrutura de saída para o cliente (JSON).
 * Para que serve?
 *   - Controla quais campos da entidade são expostos (segurança).
 *   - Usa class-transformer para serializar objetos (ex.: entity to DTO).
 *   - Evita vazamento de dados internos; transforma dates para ISO.
 * Dicas:
 *   - Use em controllers para retornar dados (ex.: plainToInstance).
 *   - Integre com converter para mapear entity → response.
 *   - Adicione mais @Expose() se precisar de campos calculados.
 * ==============================================================
 */
