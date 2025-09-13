import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceCreate {
    private cidadeRepository;
    private cidades;
    constructor(cidadeRepository: Repository<Cidade>);
    create(): null;
}
