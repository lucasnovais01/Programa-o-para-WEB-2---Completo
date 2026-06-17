import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospede } from '../entity/hospede.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HospedeServiceRemove {
  constructor(
    @InjectRepository(Hospede)
    private hospedeRepository: Repository<Hospede>,
  ) {}

  async remove(idUsuario: number): Promise<void> {
    // 1. Busca o hóspede para verificar sua existência antes de tentar excluir.
    const hospedeCadastrado = await this.hospedeRepository.findOne({
      where: { idUsuario },
    });

    // Se a busca retornar null, lança 404.
    if (!hospedeCadastrado) {
      throw new NotFoundException('Hóspede não localizado');
    }
    // 2. Executa a operação de DELETE.  // O TypeORM retorna um objeto 'DeleteResult'.
    const result = await this.hospedeRepository.delete({ idUsuario });

    // 3. Verifica se a exclusão realmente afetou 1 linha (boa prática). e manda mensagem 404 se não.
    if (result.affected === 0) {
      throw new NotFoundException('Hóspede não localizado');
    }

    return;
  }
}

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.service.remove.ts
 * ==============================================================
 * * O que é?
 * - Service específico para a operação de DELETE (Remover) no módulo Hospede.
 * * Como funciona?
 * 1. Injeta o repositório TypeORM.
 * 2. Faz uma pré-validação (`findOne`) para garantir que o ID exista e retorna 404 se não.
 * - Isso é útil para dar um feedback claro ao usuário/API cliente.
 * 3. Usa `this.hospedeRepository.delete({ idUsuario })` para remover o registro.
 * 4. Verifica `result.affected` para confirmar se a operação foi bem-sucedida.
 * 5. Retorna `void` (vazio) se a exclusão for feita.
 * * Dicas:
 * - Em TypeORM, `repository.delete()` aceita um critério (como `{ idUsuario }`) para a remoção.
 * - `NotFoundException` do NestJS mapeia para o status HTTP 404, ideal para recursos ausentes.
 * * ==============================================================
 */
