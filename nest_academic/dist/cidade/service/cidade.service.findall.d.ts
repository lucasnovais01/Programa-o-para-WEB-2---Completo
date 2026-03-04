import { Repository } from 'typeorm';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceFindAll {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    findAll(): Promise<CidadeResponse[]>;
}
