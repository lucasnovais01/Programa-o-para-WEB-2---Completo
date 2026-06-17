import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Funcionario } from '../entity/funcionario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospede } from 'src/1-hospede/entity/hospede.entity';

@Injectable()
export class FuncionarioServiceRemove {
  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,
    @InjectRepository(Hospede)
    private hospedeRepository: Repository<Hospede>,
  ) {}

  async remove(id: number): Promise<void> {
    const funcionario = await this.funcionarioRepository.findOneBy({
      idUsuario: id,
    });
    if (!funcionario) {
      throw new HttpException(
        'Funcionário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.funcionarioRepository.delete({ idUsuario: id });
    await this.hospedeRepository.update({ idUsuario: id }, { tipo: 0 });
  }
}
