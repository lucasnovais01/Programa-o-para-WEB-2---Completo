import { Repository } from 'typeorm';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceFindOne {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    findOne(idCidade: number): Promise<CidadeResponse>;
    findById(idCidade: number): Promise<Cidade | null>;
}
