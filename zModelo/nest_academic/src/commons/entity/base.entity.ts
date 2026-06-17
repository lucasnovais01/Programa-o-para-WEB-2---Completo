import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'CREATED_AT' })
  // → Cria coluna CREATED_AT no banco
  // → Preenchida AUTOMATICAMENTE na primeira inserção
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  // → Atualizada AUTOMATICAMENTE em todo UPDATE
  updatedAt!: Date;

  // Construtor opcional com Partial
  // → Útil em testes ou DTOs: new Hospede({ nome: 'Lucas' })
  // → TypeORM ignora se não usado

  constructor(data: Partial<BaseEntity> = {}) {
    Object.assign(this, data);
  }
}

// Aqui tem dois erros:

/*

// Unsafe call of a(n) `error` type typed value.eslint@typescript-eslint/no-unsafe-call
(alias) CreateDateColumn(options?: ColumnOptions): PropertyDecorator
import CreateDateColumn
This column will store a creation date of the inserted object. Creation date is generated and inserted only once, at the first time when you create an object, the value is inserted into the table, and is never touched again.


Unsafe call of a(n) `error` type typed value.eslint@typescript-eslint/no-unsafe-call
(alias) UpdateDateColumn(options?: ColumnOptions): PropertyDecorator
import UpdateDateColumn
This column will store an update date of the updated object. This date is being updated each time you persist the object.


*/

/**
 * ==============================================================
 * RESUMO RÁPIDO
 * ==============================================================
 *
 * - Toda entidade HERDA de BaseEntity
 * - Garante CREATED_AT e UPDATED_AT em todas as tabelas
 * - TypeORM + Oracle cuidam da lógica automaticamente
 *
 * ==============================================================
 */
