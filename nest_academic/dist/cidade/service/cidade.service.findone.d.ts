import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeServiceFindOne {
    private cidadeRepository;
    idCidade: any;
    constructor(cidadeRepository: Repository<Cidade>);
    findById(idCidade: number): Promise<CidadeResponse>;
}
