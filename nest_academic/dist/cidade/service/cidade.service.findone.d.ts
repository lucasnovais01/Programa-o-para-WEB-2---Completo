import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeServiceFindOne {
    private cidadeRepository;
    private cidade;
    constructor(cidadeRepository: Repository<Cidade>);
    findOne(idCidade: number): Promise<CidadeResponse>;
}
