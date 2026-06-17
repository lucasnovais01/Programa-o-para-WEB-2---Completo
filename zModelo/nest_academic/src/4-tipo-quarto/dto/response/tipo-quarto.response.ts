import { Expose } from "class-transformer";

export class TipoQuartoResponse {
  @Expose()
  codigoTipoQuarto?: number;

  @Expose()
  nomeTipo: string = "";

  @Expose()
  capacidadeMaxima: number = 2;

  @Expose()
  valorDiaria: number = 0;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;
}
