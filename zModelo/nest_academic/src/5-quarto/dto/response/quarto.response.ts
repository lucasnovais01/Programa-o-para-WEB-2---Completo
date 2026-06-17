import { Expose } from "class-transformer";

export class QuartoResponse {
  @Expose()
  idQuarto?: number;

  @Expose()
  codigoTipoQuarto: number = 0;

  @Expose()
  numero: number = 0;

  @Expose()
  statusQuarto: string = "LIVRE";

  @Expose()
  andar: number = 0;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;
}
