import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConverterHospede } from '../dto/converter/hospede.converter';
import { HospedeRequest } from '../dto/request/hospede.request';
import { Repository } from 'typeorm';
import { Hospede } from '../entity/hospede.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HospedeResponse } from '../dto/response/hospede.response';

@Injectable()
export class HospedeServiceCreate {
  constructor(
    @InjectRepository(Hospede)
    private hospedeRepository: Repository<Hospede>,
  ) {}

  async create(
    hospedeRequest: HospedeRequest,
  ): Promise<HospedeResponse | null> {
    let hospede = ConverterHospede.toHospede(hospedeRequest);

    const hospedeCadastrado = await this.hospedeRepository
      .createQueryBuilder('hospede')
      .where('hospede.cpf =:cpf', { cpf: hospede.cpf })
      .getOne();

    if (hospedeCadastrado) {
      throw new HttpException(
        'O hóspede com o CPF informado já está cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    hospede = await this.hospedeRepository.save(hospede);

    return ConverterHospede.toHospedeResponse(hospede);
  }
}

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.service.create.ts
 * ==============================================================
 * O que é?
 *   - Service específico para a operação de CREATE no módulo Hospede.
 * Como funciona?
 *   1. Injeta repositório TypeORM para Hospede.
 *   2. Converte HospedeRequest para entidade via converter.
 *   3. Verifica duplicidade por CPF (UNIQUE no DDL); lança HttpException se existir.
 *   4. Salva a entidade no banco via repository.save.
 *   5. Converte entidade salva para HospedeResponse e retorna.
 * Por quê separado?
 *   - Organização: Lógica de negócios isolada por operação.
 *   - Facilita injeção, testes e reutilização.
 * Dicas:
 *   - Validações do DTO já ocorreram no controller.
 *   - Erros são propagados para o filter global formatar.
 *   - Integra com converter para mapear DTO ↔ entity.

 * ==============================================================
 */
