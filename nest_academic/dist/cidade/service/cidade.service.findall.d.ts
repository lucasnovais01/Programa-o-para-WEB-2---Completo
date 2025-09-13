import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeServiceFindAll {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    findAll(): Promise<CidadeResponse[]>;
}
