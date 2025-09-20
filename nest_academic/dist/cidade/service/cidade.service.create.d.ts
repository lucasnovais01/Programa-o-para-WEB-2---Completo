import { CidadeRequest } from '../dto/request/cidade.request';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceCreate {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    create(cidadeRequest: CidadeRequest): Promise<null>;
}
