import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Req,
} from "@nestjs/common";
import type { Request } from "express";
import { TIPO_QUARTO } from "src/commons/constants/constants.sistema";
import { ROTA } from "src/commons/constants/url.sistema";
import { Result } from "src/commons/mensagem/mensagem";
import { MensagemSistema } from "src/commons/mensagem/mensagem.sistema";
import { gerarLinks } from "src/commons/utils/hateoas.utils";
import { TipoQuartoResponse } from "../dto/response/tipo-quarto.response";
import { TipoQuartoServiceFindOne } from "../service/tipo-quarto.service.findone";

@Controller(ROTA.TIPO_QUARTO.BASE.substring(1))
export class TipoQuartoControllerFindOne {
  constructor(
    private readonly tipoQuartoServiceFindOne: TipoQuartoServiceFindOne
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.TIPO_QUARTO.ENDPOINTS.BY_ID)
  async findOne(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Result<TipoQuartoResponse | null>> {
    const response = await this.tipoQuartoServiceFindOne.findOne(id);

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      "Tipo de quarto recuperado com sucesso",
      response,
      ROTA.TIPO_QUARTO.BY_ID,
      null,
      response?.codigoTipoQuarto
        ? gerarLinks(req, TIPO_QUARTO, response.codigoTipoQuarto)
        : gerarLinks(req, TIPO_QUARTO),
    );
  }
}
