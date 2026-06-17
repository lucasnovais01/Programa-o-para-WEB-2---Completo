import { plainToInstance } from "class-transformer";
import { TipoQuarto } from "src/4-tipo-quarto/entity/tipo-quarto.entity";
import { TipoQuartoRequest } from "../request/tipo-quarto.request";
import { TipoQuartoResponse } from "../response/tipo-quarto.response";

export class TipoQuartoConverter {
  static toTipoQuarto(tipoQuartoRequest: TipoQuartoRequest): TipoQuarto {
    const tq = new TipoQuarto();

    if (tipoQuartoRequest.codigoTipoQuarto != null) {
      tq.codigoTipoQuarto = tipoQuartoRequest.codigoTipoQuarto;
    }

    tq.nomeTipo = tipoQuartoRequest.nomeTipo;
    tq.capacidadeMaxima = tipoQuartoRequest.capacidadeMaxima ?? 2;
    tq.valorDiaria = tipoQuartoRequest.valorDiaria;

    return tq;
  }

  static toTipoQuartoResponse(tipoQuarto: TipoQuarto): TipoQuartoResponse {
    return plainToInstance(TipoQuartoResponse, tipoQuarto, {
      excludeExtraneousValues: true,
    });
  }

  static toListTipoQuartoResponse(
    tiposQuarto: TipoQuarto[] = []
  ): TipoQuartoResponse[] {
    return plainToInstance(TipoQuartoResponse, tiposQuarto, {
      excludeExtraneousValues: true,
    });
  }
}
