import { Expose } from 'class-transformer';

export class CidadeResponse {
  // Todo campo que é permitido ao cliente ver

  @Expose()
  idCidade: number;

  @Expose()
  codCidade: string;

  @Expose()
  nomeCidade: string;
}
