import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
export declare class CidadeServiceUpdate {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    update(): null;
}
