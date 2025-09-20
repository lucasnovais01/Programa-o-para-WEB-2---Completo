import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
import { CidadeServiceFindOne } from './cidade.service.findone';
export declare class CidadeServiceRemove {
    private cidadeRepository;
    private readonly service;
    constructor(cidadeRepository: Repository<Cidade>, service: CidadeServiceFindOne);
    remove(idCidade: number): Promise<void>;
}
