import { plainToInstance } from "class-transformer";
import { Quarto } from "src/5-quarto/entity/quarto.entity";
import { QuartoRequest } from "../request/quarto.request";
import { QuartoResponse } from "../response/quarto.response";

export class QuartoConverter {
  static toQuarto(quartoRequest: QuartoRequest): Quarto {
    const q = new Quarto();

    if (quartoRequest.idQuarto != null) {
      q.idQuarto = quartoRequest.idQuarto;
    }

    q.codigoTipoQuarto = quartoRequest.codigoTipoQuarto;
    q.numero = quartoRequest.numero;
    q.statusQuarto = quartoRequest.statusQuarto ?? "LIVRE";
    q.andar = quartoRequest.andar ?? 0;

    return q;
  }

  static toQuartoResponse(quarto: Quarto): QuartoResponse {
    return plainToInstance(QuartoResponse, quarto, {
      excludeExtraneousValues: true,
    });
  }

  static toListQuartoResponse(quartos: Quarto[] = []): QuartoResponse[] {
    return plainToInstance(QuartoResponse, quartos, {
      excludeExtraneousValues: true,
    });
  }
}
