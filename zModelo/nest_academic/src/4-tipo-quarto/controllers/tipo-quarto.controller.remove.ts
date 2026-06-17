import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { ROTA } from "src/commons/constants/url.sistema";
import { Result } from "src/commons/mensagem/mensagem";
import { MensagemSistema } from "src/commons/mensagem/mensagem.sistema";
import { TipoQuartoServiceRemove } from "../service/tipo-quarto.service.remove";

@Controller(ROTA.TIPO_QUARTO.BASE.substring(1))
export class TipoQuartoControllerRemove {
  constructor(
    private readonly tipoQuartoServiceRemove: TipoQuartoServiceRemove
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(ROTA.TIPO_QUARTO.ENDPOINTS.DELETE)
  async remove(
    @Req() req: Request,
    @Param("id") id: string
  ): Promise<Result<null>> {
    await this.tipoQuartoServiceRemove.remove(Number(id));

    return MensagemSistema.showMensagem(
      HttpStatus.NO_CONTENT,
      "Tipo de quarto removido com sucesso",
      null,
      ROTA.TIPO_QUARTO.DELETE,
      null
    );
  }
}
