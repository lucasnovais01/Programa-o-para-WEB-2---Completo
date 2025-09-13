import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
export declare class CidadeServiceFindAll {
    private cidadeRepository;
    private cidades;
    constructor(cidadeRepository: Repository<Cidade>);
    findAll(): Promise<Cidade[]>;
}
