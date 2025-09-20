import { CidadeRequest } from '../dto/request/cidade.request';
import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
import { CidadeServiceFindOne } from './cidade.service.findone';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeServiceUpdate {
    private cidadeRepository;
    private cidadeServiceFindOne;
    constructor(cidadeRepository: Repository<Cidade>, cidadeServiceFindOne: CidadeServiceFindOne);
    update(id: number, cidadeRequest: CidadeRequest): Promise<CidadeResponse | null>;
}
