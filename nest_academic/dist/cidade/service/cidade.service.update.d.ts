import { Repository } from 'typeorm';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';
import { CidadeServiceFindOne } from './cidade.service.findone';
export declare class CidadeServiceUpdate {
    private cidadeRepository;
    private cidadeServiceFindOne;
    constructor(cidadeRepository: Repository<Cidade>, cidadeServiceFindOne: CidadeServiceFindOne);
    update(idCidade: number, cidadeRequest: CidadeRequest): Promise<CidadeResponse>;
}
