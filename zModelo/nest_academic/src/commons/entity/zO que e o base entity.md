/**
 * ==============================================================
 * BASE.ENTITY.TS - Sistema COCAO Hotel
 * ==============================================================
 * 
 * O QUE É?
 *   Classe ABSTRATA que serve como BASE para TODAS as entidades do sistema.
 *   Garante que toda tabela tenha:
 *     - CREATED_AT (data de criação)
 *     - UPDATED_AT (data de atualização)
 * 
 * POR QUE USAR?
 *   - Evita repetir os mesmos campos em todas as entidades
 *   - TypeORM atualiza automaticamente via @CreateDateColumn e @UpdateDateColumn
 *   - Padrão profissional (DRY - Don't Repeat Yourself)
 * 
 * COMO FUNCIONA?
 *   1. Toda entidade (ex: Hospede) estende BaseEntity
 *   2. TypeORM cria as colunas no banco automaticamente
 *   3. Oracle preenche com SYSTIMESTAMP (conforme DDL)
 * 
 * EXEMPLO DE USO:
 *   @Entity() export class Hospede extends BaseEntity { ... }
 * 
 * ==============================================================
 */

import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Classe ABSTRATA (não pode ser instanciada diretamente)
 * Serve como herança para todas as entidades do sistema
 */
export abstract class BaseEntity {

  /**
   * @CreateDateColumn
   * → Cria coluna CREATED_AT no banco
   * → Preenchida AUTOMATICAMENTE na primeira inserção
   * → Equivalente ao DEFAULT SYSTIMESTAMP do Oracle
   */
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  /**
   * @UpdateDateColumn
   * → Cria coluna UPDATED_AT no banco
   * → Atualizada AUTOMATICAMENTE em todo UPDATE
   * → Equivalente ao ON UPDATE SYSTIMESTAMP
   */
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  /**
   * Construtor opcional com Partial
   * → Permite criar entidade com dados parciais (útil em testes ou DTOs)
   * → Ex: new Hospede({ nome: 'Lucas' })
   * → Não é obrigatório — TypeORM ignora se não usado
   */
  constructor(data: Partial<BaseEntity> = {}) {
    Object.assign(this, data);
  }
}

/**
 * ==============================================================
 * RESUMO RÁPIDO
 * ==============================================================
 * 
 * - Toda entidade HERDA de BaseEntity
 * - Garante CREATED_AT e UPDATED_AT em todas as tabelas
 * - TypeORM + Oracle cuidam da lógica automaticamente
 * - Código limpo, reutilizável e profissional
 * 
 * ==============================================================
 */