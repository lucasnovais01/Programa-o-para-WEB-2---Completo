import { plainToInstance, instanceToPlain } from 'class-transformer';
import { Hospede } from 'src/1-hospede/entity/hospede.entity';
import { HospedeRequest } from '../request/hospede.request';
import { HospedeResponse } from '../response/hospede.response';

/**
 * Conversor para Hospede.
 * Mapeia entre DTOs e entidade para transferências de dados.
 * - toHospede: Request → Entidade (para create/update).
 * - toHospedeResponse: Entidade → Response (para saídas).
 * - toListHospedeResponse: Lista de Entidades → Lista de Responses.
 * Observações:
 * - Usa plainToInstance para serialização segura (exclui extras).
 * - Campos opcionais só mapeados se definidos na request.
 */

/*
 * Diferenças em relação ao modelo antigo ('ConverterCidade'):
 * 1. Mais campos: Antigo mapeava 2-3 campos simples. Aqui, mapeamos todos (strings, dates, numbers, opcionais), com checks para undefined/null.
 * 2. Mapeamento opcional: Adicionado if (request.campo !== undefined) para opcionais, evitando sobrescrever defaults no banco.
 * 3. Defaults: Mantidos via entidade (ex.: tipo=0), mas request pode sobrescrever.
 * 4. Placeholders: Removidos os throws/comentados; focamos em funções úteis.
 * 5. plainToInstance: Mantido para responses; alternativa manual comentada no antigo não usada aqui (mais verbosa).
 */

export class ConverterHospede {
  static toHospede(hospedeRequest: HospedeRequest): Hospede {
    // Cria entidade a partir do DTO de request.
    const hospede = new Hospede();

    // ID só para updates; banco gerencia creates.
    if (hospedeRequest.idUsuario != null) {
      hospede.idUsuario = hospedeRequest.idUsuario;
    }

    hospede.nomeHospede = hospedeRequest.nomeHospede;
    hospede.cpf = hospedeRequest.cpf;
    hospede.sexo = hospedeRequest.sexo;
    hospede.dataNascimento = hospedeRequest.dataNascimento;
    hospede.tipo = hospedeRequest.tipo;
    hospede.ativo = hospedeRequest.ativo;

    // Campos opcionais: só atribui se definidos.
    if (hospedeRequest.rg !== undefined) {
      hospede.rg = hospedeRequest.rg;
    }
    if (hospedeRequest.email !== undefined) {
      hospede.email = hospedeRequest.email;
    }
    if (hospedeRequest.telefone !== undefined) {
      hospede.telefone = hospedeRequest.telefone;
    }

    return hospede;
  }

  static toHospedeResponse(hospede: Hospede): HospedeResponse {
    /*
    // como tava antes: alternativa manual comentada

    return painToInstance(HospedeResponse, hospede, {
      excludeExtraneousValues: true,
    });
    */
    // Converte entidade para um objeto plain (JSON) respeitando @Expose().
    // Processo seguro em duas etapas:
    // 1) plainToInstance cria uma instância de HospedeResponse aplicando @Expose/@Transform
    //    e removendo campos extras (excludeExtraneousValues).
    // 2) instanceToPlain transforma essa instância em um POJO pronto para serialização.
    // Isso produz um objeto JSON limpo para controllers, sem expor metadados de classe
    // que poderiam confundir o TypeORM se usados indevidamente em operações de save.
    const inst = plainToInstance(HospedeResponse, hospede, {
      excludeExtraneousValues: true,
    });
    return instanceToPlain(inst) as unknown as HospedeResponse;
  }

  static toListHospedeResponse(hospedes: Hospede[] = []): HospedeResponse[] {
    // Converte lista de entidades para lista de responses.
    return plainToInstance(HospedeResponse, hospedes, {
      excludeExtraneousValues: true,
    });
  }
}

/**
 * ==============================================================
 * TUTORIAL RÁPIDO: hospede.converter.ts
 * ==============================================================
 * O que é?
 *   - Classe utilitária para conversões entre DTOs e entidade.
 *   - Evita acoplamento direto; facilita manutenção.
 * Para que serve?
 *   - No service: Request → Entidade para salvar no banco.
 *   - No controller: Entidade → Response para retornar JSON seguro.
 *   - Usa class-transformer para mapear e excluir campos extras.
 * Dicas:
 *   - Chame em services/controllers (ex.: ConverterHospede.toHospede(dto)).
 *   - Expanda se precisar de conversões reversas ou customizadas.
 *   - Integra com validation (request) e serialization (response).
 * ==============================================================
 */
