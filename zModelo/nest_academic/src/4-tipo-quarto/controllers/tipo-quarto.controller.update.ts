import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Put,
    Req,
} from "@nestjs/common";
import type { Request } from "express";
import { TIPO_QUARTO } from "src/commons/constants/constants.sistema";
import { ROTA } from "src/commons/constants/url.sistema";
import { Result } from "src/commons/mensagem/mensagem";
import { MensagemSistema } from "src/commons/mensagem/mensagem.sistema";
import { gerarLinks } from "src/commons/utils/hateoas.utils";
import { TipoQuartoRequest } from "../dto/request/tipo-quarto.request";
import { TipoQuartoResponse } from "../dto/response/tipo-quarto.response";
import { TipoQuartoServiceUpdate } from "../service/tipo-quarto.service.update";

@Controller(ROTA.TIPO_QUARTO.BASE.substring(1))
export class TipoQuartoControllerUpdate {
  constructor(
    private readonly tipoQuartoServiceUpdate: TipoQuartoServiceUpdate
  ) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.TIPO_QUARTO.ENDPOINTS.UPDATE)
  async update(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
    @Body() tipoQuartoRequest: TipoQuartoRequest
  ): Promise<Result<TipoQuartoResponse | null>> {
    const response = await this.tipoQuartoServiceUpdate.update(
      id,
      tipoQuartoRequest,
    );
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      "Tipo de quarto atualizado com sucesso",
      response,
      ROTA.TIPO_QUARTO.UPDATE,
      null,
      gerarLinks(req, TIPO_QUARTO, id),
    );
  }
}
