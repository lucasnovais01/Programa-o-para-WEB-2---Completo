import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
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
import { TipoQuartoServiceCreate } from "../service/tipo-quarto.service.create";

@Controller(ROTA.TIPO_QUARTO.BASE.substring(1))
export class TipoQuartoControllerCreate {
  constructor(
    private readonly tipoQuartoServiceCreate: TipoQuartoServiceCreate
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(ROTA.TIPO_QUARTO.ENDPOINTS.CREATE)
  async create(
    @Req() req: Request,
    @Body() tipoQuartoRequest: TipoQuartoRequest
  ): Promise<Result<TipoQuartoResponse>> {
    const response =
      await this.tipoQuartoServiceCreate.create(tipoQuartoRequest);

    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      "Tipo de quarto cadastrado com sucesso!",
      response,
      ROTA.TIPO_QUARTO.CREATE,
      null,
      response?.codigoTipoQuarto
        ? gerarLinks(req, TIPO_QUARTO, response.codigoTipoQuarto)
        : gerarLinks(req, TIPO_QUARTO),
    );
  }
}
