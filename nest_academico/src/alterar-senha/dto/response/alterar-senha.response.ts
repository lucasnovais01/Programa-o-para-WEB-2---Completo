import { ApiProperty } from '@nestjs/swagger';

export class AlterarSenhaResponse {
  @ApiProperty({ description: 'Mensagem de sucesso ou erro', example: 'Senha alterada com sucesso' })
  mensagem: string;

  @ApiProperty({ description: 'Indica se a operação foi bem sucedida', example: true })
  sucesso: boolean;
}