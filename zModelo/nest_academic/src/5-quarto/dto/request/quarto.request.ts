import { Type } from "class-transformer";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class QuartoRequest {
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: "ID do quarto deve ser número" })
  idQuarto?: number;

  @Type(() => Number)
  @IsNotEmpty({ message: "Código do tipo de quarto deve ser informado" })
  @IsNumber({}, { message: "Código do tipo de quarto deve ser número" })
  codigoTipoQuarto: number = 0;

  @Type(() => Number)
  @IsNotEmpty({ message: "Número do quarto deve ser informado" })
  @IsNumber({}, { message: "Número do quarto deve ser número" })
  @Min(1, { message: "Número do quarto deve ser maior que 0" })
  numero: number = 0;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsIn(["LIVRE", "OCUPADO", "MANUTENCAO"], {
    message: "Status do quarto deve ser LIVRE, OCUPADO ou MANUTENCAO",
  })
  statusQuarto: string = "LIVRE";

  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: "Andar deve ser número" })
  @Min(0, { message: "Andar não pode ser negativo" })
  andar: number = 0;

  constructor(data: Partial<QuartoRequest> = {}) {
    Object.assign(this, data);
  }
}
