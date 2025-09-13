import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
export declare class CidadeServiceRemove {
    private cidadeRepository;
    private cidade;
    constructor(cidadeRepository: Repository<Cidade>);
    remove(): null;
}
