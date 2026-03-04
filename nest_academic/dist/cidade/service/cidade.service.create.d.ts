import { Repository } from 'typeorm';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceCreate {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    create(cidadeRequest: CidadeRequest): Promise<CidadeResponse>;
}
