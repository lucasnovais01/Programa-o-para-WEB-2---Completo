import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HospedeRequest } from '../dto/request/hospede.request';
import { ConverterHospede } from '../dto/converter/hospede.converter';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospede } from '../entity/hospede.entity';
import { Repository } from 'typeorm';
import { HospedeServiceFindOne } from './hospede.service.findone';
import { HospedeResponse } from '../dto/response/hospede.response';

@Injectable()
export class HospedeServiceUpdate {
  constructor(
    @InjectRepository(Hospede)
    private hospedeRepository: Repository<Hospede>,
    private hospedeServiceFindOne: HospedeServiceFindOne, // Injeta o service de busca (FindOne) para reutilizar a lógica de validação
  ) {}

  async update(
    idUsuario: number,
    hospedeRequest: HospedeRequest,
  ): Promise<HospedeResponse | null> {
    //
    /* ANTIGO, o novo 1. está entre o 3. e o 4. - POSTMAN Update não está funcionando (tentava INSERT ao invés de UPDATE)

  // 1. Converte o DTO de Request (hospedeRequest) para a Entidade (hospede)
  let hospede = ConverterHospede.toHospede(hospedeRequest);
  */

    // 2. Busca o cadastro existente usando o service FindOne.
    const hospedeCadastrado =
      await this.hospedeServiceFindOne.findById(idUsuario);

    // 3. Validação de existência: se não existir, lança uma exceção HTTP 404 (Not Found)
    if (!hospedeCadastrado) {
      throw new HttpException('Hóspede não cadastrado', HttpStatus.NOT_FOUND);
    }

    // 1. Converte o DTO de Request (hospedeRequest) para a Entidade (hospede)
    // Garantindo que o ID seja mantido durante o update
    let hospede = ConverterHospede.toHospede({
      ...hospedeRequest,
      idUsuario: hospedeCadastrado.idUsuario, // Mantém o ID original
    });

    // 4. Mescla os novos dados (Entidade 'hospede') sobre o cadastro encontrado (Response 'hospedeCadastrado')
    const hospedeAtualizado = Object.assign(hospedeCadastrado, hospede);

    // 5. Salva o objeto mesclado.
    // O TypeORM 'save' é flexível: ele aceita o objeto 'hospedeAtualizado'
    // (que é uma mistura de Response+Entity) e executa o UPDATE
    // porque reconhece a chave primária (idUsuario) nele.
    hospede = await this.hospedeRepository.save(hospedeAtualizado);

    // 6. Converte a entidade salva (retornada pelo save) para o DTO de Response
    return ConverterHospede.toHospedeResponse(hospede);
  }
}

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.service.update.ts
 * ==============================================================
 * * O que é?
 * - Service específico para a operação de UPDATE (Atualizar) no módulo Hospede.
 * * Como funciona? (Seguindo o padrão do professor)
 * 1. Injeta o Repositório (`HospedeRepository`) e o Service de Busca (`HospedeServiceFindOne`).
 * 2. Converte o DTO de Request para uma Entidade (`ConverterHospede.toHospede`).
 * 3. Usa `hospedeServiceFindOne.findById(idUsuario)` para verificar a existência.
 * 4. Lança `HttpException` com `HttpStatus.NOT_FOUND` se não existir.
 * 5. Usa `Object.assign` para mesclar os novos dados na entidade/dto existente.
 * 6. Usa `repository.save()` para executar o UPDATE no banco.
 * 7. Retorna o DTO de resposta do hóspede atualizado.
 * * Dicas:
 * - A injeção de outro service (`HospedeServiceFindOne`) promove a reutilização de código.
 * - O uso de `HttpException` é a forma base do NestJS para retornar erros HTTP.
 * * ==============================================================
 */

/*
 * ==============================================================
 * NOTA SOBRE UPDATE E TYPEORM: Preservando IDs
 * ==============================================================

 * Problema encontrado:
 * - Ao tentar fazer update, o TypeORM tentava executar um INSERT,
 *   resultando em ORA-00001 (unique constraint violation).
 * - A ordem das operações (converter DTO → buscar → mesclar) fazia o
 *   ID se perder durante as transformações.

 * Como funciona a solução:
 * 1. Primeiro busca o registro existente (para ter certeza que existe
 *    e para ter uma entidade com ID válido).
 * 2. Depois converte o DTO para entidade e mescla com Object.assign.
 * 3. TypeORM vê o ID na entidade e faz UPDATE em vez de INSERT.
 * 
 * Resultado:
 * - UPDATE funciona corretamente.
 * - Mantém consistência do banco (sem duplicar CPFs).
 * - Mantém o padrão do professor (findById → assign → save).

 * Dica importante:
 * - Sempre preserve o ID ao fazer updates com TypeORM.
 * - Object.assign deve ter como primeiro parâmetro um objeto que já
 *   tem o ID (por isso buscamos primeiro).
 * - Se o ID for perdido, TypeORM tenta INSERT em vez de UPDATE.
 * ==============================================================
 */
