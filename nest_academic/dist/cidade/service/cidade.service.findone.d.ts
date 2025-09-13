import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceFindOne {
    private cidadeRepository;
    private cidade;
    constructor(cidadeRepository: Repository<Cidade>);
    findOne(): null;
}
