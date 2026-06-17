import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class TipoQuartoRequest {
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: "Código do tipo de quarto deve ser número" })
  codigoTipoQuarto?: number;

  @IsNotEmpty({ message: "Nome do tipo de quarto deve ser informado" })
  @IsString()
  @MaxLength(50)
  nomeTipo: string = "";

  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: "Capacidade máxima deve ser número" })
  @Min(1, { message: "Capacidade máxima deve ser maior que 0" })
  capacidadeMaxima: number = 2;

  @Type(() => Number)
  @IsNotEmpty({ message: "Valor da diária deve ser informado" })
  @IsNumber({}, { message: "Valor da diária deve ser número" })
  @Min(0.01, { message: "Valor da diária deve ser maior que 0" })
  valorDiaria: number = 0;

  constructor(data: Partial<TipoQuartoRequest> = {}) {
    Object.assign(this, data);
  }
}
