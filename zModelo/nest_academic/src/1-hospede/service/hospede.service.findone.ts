import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospede } from '../entity/hospede.entity';

// Não
// import { HospedeResponse } from '../dto/response/hospede.response';
// import { ConverterHospede } from '../dto/converter/hospede.converter';

@Injectable()
export class HospedeServiceFindOne {
  // idUsuario: any; // Removido, pois não é injetado, apenas passado como parâmetro.
  // Não era preenchida no constructor, não era usada em lugar nenhum.
  // idUsuario: any;     // ← perde tipagem
  constructor(
    @InjectRepository(Hospede)
    private hospedeRepository: Repository<Hospede>,
  ) {}

  /** Comentário do JSDoc (JavaScript Documentation) // tem que colocar dois asteriscos no começo
    Busca um hóspede no banco de dados pelo seu ID (ID_USUARIO). No Oracle está como INTEGER, mas aqui pode usar number
    @param idUsuario = Significa que: o ID (chave primária) do hóspede/funcionário a ser buscado.
    @returns         = Significa que: o DTO de resposta do hóspede encontrado.
    @throws          = Significa que: HttpException NOT_FOUND se o hóspede não for encontrado.
*/

  // Utiliza o método findOne do TypeORM, que é o mais simples para busca por PK/Unique.
  // { where: { idUsuario } } é a forma abreviada de { where: { idUsuario: idUsuario } }

  /*
  como estava antes: 
  
  async findById(idUsuario: number): Promise<HospedeResponse> {
  */
  async findById(idUsuario: number): Promise<Hospede> {
    const hospede = await this.hospedeRepository.findOne({
      where: { idUsuario },
    });

    // Se o repositório não encontrar o registro, ele retorna null/undefined.
    if (!hospede) {
      throw new HttpException('Hóspede não cadastrado', HttpStatus.NOT_FOUND);
    }

    /*
    Como era o return antes: 
    
    return ConverterHospede.toHospedeResponse(hospede);
    */

    // Retorna a entidade encontrada (não o DTO). Controllers que precisarem do
    // DTO devem chamar ConverterHospede.toHospedeResponse(hospede) — isso evita
    // que o service retorne instâncias de DTO que podem confundir o TypeORM
    // quando usadas em operações de save/merge.
    return hospede;
  }
}
/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.service.findone.ts
 * ==============================================================
 * * O que é?
 * - Service específico para a operação de READ (Buscar Um - Find One) no módulo Hospede.
 * * Como funciona?
 * 1. Injeta o repositório TypeORM da entidade Hospede no constructor.
 * 2. O método findById recebe o ID do controller.
 * 3. Usa `this.hospedeRepository.findOne({ where: { idUsuario } })` para buscar no banco.
 * 4. Se não encontrar o registro, lança uma exceção HTTP 404 (NOT_FOUND).
 * 5. Se encontrar, converte a entidade para HospedeResponse via ConverterHospede.
 * * Por quê separado?
 * - Segue o padrão de isolar a lógica de busca em um service dedicado, facilitando a reutilização
 * (por exemplo, se outros services precisarem validar a existência de um hóspede).
 * * Dicas:
 * - `findOne` é preferível a `createQueryBuilder().getOne()` para buscas simples por PK.
 * - A exceção HttpException garante que o NestJS retorne uma resposta de erro JSON padronizada.
 * * ==============================================================
 */
