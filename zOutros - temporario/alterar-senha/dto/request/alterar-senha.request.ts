import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// import { IsPasswordStrong } from '../../decorators/password-validator.decorator';
// O decorator IsPasswordStrong seria usado se você quisesse validar
// força de senha com regex (ex: pelo menos 1 letra maiúscula, 1 número, 1 caractere especial)
// Para este projeto simples, não usaremos regex de validação de senha

export class AlterarSenhaRequest {
  @IsNotEmpty({ message: 'A senha atual deve ser informada' })
  @IsString({ message: 'A senha atual deve ser um texto' })
  @ApiProperty({ description: 'Senha atual do usuário', example: 'senha123' })
  senhaAtual: string;

  @IsNotEmpty({ message: 'A nova senha deve ser informada' })
  @IsString({ message: 'A nova senha deve ser um texto' })
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'A nova senha deve ter no máximo 20 caracteres' })
  @ApiProperty({ description: 'Nova senha do usuário', example: 'novaSenha123' })
  novaSenha: string;

  @IsNotEmpty({ message: 'A confirmação de senha deve ser informada' })
  @IsString({ message: 'A confirmação de senha deve ser um texto' })
  @ApiProperty({ description: 'Confirmação da nova senha', example: 'novaSenha123' })
  confirmarSenha: string;
}