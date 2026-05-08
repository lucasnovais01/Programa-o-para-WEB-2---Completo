/*
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { USUARIO } from '../../constants/usuario.constants';

export class UsuarioRequest {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ description: USUARIO.SWAGGER.ID_USUARIO, example: '1' })
  idUsuario?: number;

  @IsNotEmpty({ message: USUARIO.INPUT_ERROR.NOME_USUARIO.BLANK })
  @IsString({ message: USUARIO.INPUT_ERROR.NOME_USUARIO.STRING })
  @MaxLength(100, {
    message: 'O tamanho máximo é de 100 caracteres para o nome do usuário',
  })
  @ApiProperty({
    description: USUARIO.SWAGGER.NOME_USUARIO,
    example: 'João',
  })
  nomeUsuario: string = '';

  @IsNotEmpty({ message: USUARIO.INPUT_ERROR.SOBRENOME_USUARIO.BLANK })
  @IsString({ message: USUARIO.INPUT_ERROR.SOBRENOME_USUARIO.STRING })
  @MaxLength(100, {
    message: 'O tamanho máximo é de 100 caracteres para o sobrenome do usuário',
  })
  @ApiProperty({
    description: USUARIO.SWAGGER.SOBRENOME_USUARIO,
    example: 'Silva',
  })
  sobrenomeUsuario: string = '';

  @IsNotEmpty({ message: USUARIO.INPUT_ERROR.EMAIL_USUARIO.BLANK })
  @IsString({ message: USUARIO.INPUT_ERROR.EMAIL_USUARIO.STRING })
  @MaxLength(100, {
    message: 'O tamanho máximo é de 100 caracteres para o email do usuário',
  })
  @ApiProperty({
    description: USUARIO.SWAGGER.EMAIL_USUARIO,
    example: 'joao.silva@example.com',
  })
  emailUsuario: string = '';

  @IsNotEmpty({ message: USUARIO.INPUT_ERROR.SENHA_USUARIO.BLANK })
  @IsString({ message: USUARIO.INPUT_ERROR.SENHA_USUARIO.STRING })
  @MaxLength(100, {
    message: 'O tamanho máximo é de 100 caracteres para a senha do usuário',
  })
  @ApiProperty({
    description: USUARIO.SWAGGER.SENHA_USUARIO,
    example: 'senha123',
  })
  senhaUsuario: string = '';

  constructor(data: Partial<UsuarioRequest> = {}) {
    Object.assign(this, data);
  }
}

*/
