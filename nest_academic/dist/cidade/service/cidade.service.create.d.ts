import { CidadeRequest } from '../dto/request/cidade.request';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeServiceCreate {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    create(cidadeRequest: CidadeRequest): Promise<CidadeResponse | null>;
}
