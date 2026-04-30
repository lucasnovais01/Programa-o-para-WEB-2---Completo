/*
O que o serviço de auth faz é:

Recebe email e senha
Busca na tabela Usuario
Compara a senha
Retorna o token JWT

*/
// Auth usa a entidade Usuario, não uma entidade própria, porque o que queremos é autenticar um usuário existente, não criar um novo tipo de entidade. O serviço de auth é responsável por verificar as credenciais do usuário (email e senha) e, se forem válidas, gerar um token JWT para esse usuário. Ele não precisa de uma entidade separada porque está lidando diretamente com os dados do usuário que já estão na tabela Usuario. A autenticação é um processo que envolve a verificação das informações do usuário, e não a criação de uma nova entidade, por isso o serviço de auth interage diretamente com a entidade Usuario.

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// MUDANÇA 1: Importamos Usuario no lugar de Auth
// Motivo: não existe tabela Auth no banco. O login valida credenciais
// que estão na tabela Usuario. Auth não é uma entidade nova, é uma operação.
import { Usuario } from '../../usuario/entity/usuario.entity';

import { AuthRequest } from '../dto/request/auth.request';
import { AuthResponse } from '../dto/response/auth.response';
import { ConverterAuth } from '../dto/converter/auth.converter';

@Injectable()
export class AuthService {
  constructor(
    // MUDANÇA 2: Repository<Usuario> no lugar de Repository<Auth>
    // Motivo: o TypeORM precisa saber QUAL tabela consultar.
    // Como Auth não tem tabela, usamos a tabela de Usuario.
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async login(authRequest: AuthRequest): Promise<AuthResponse> {
    // Busca o usuário pelo email
    const usuario = await this.findByEmail(authRequest.emailUsuario);

    if (!usuario) {
      // Mensagem genérica, não revela se o email existe ou não
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Importante: Compara a senha digitada com o hash salvo no banco

    const senhaCorreta = await bcrypt.compare(
      authRequest.senhaUsuario, // senha que o usuário digitou (texto puro)
      usuario.senhaUsuario, // hash que está no banco
    );

    if (!senhaCorreta) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Converte para response (sem expor a senha)
    return ConverterAuth.toAuthResponse(usuario);
  }

  // MUDANÇA 3: retorna Usuario | null no lugar de Auth | null
  // e usa usuarioRepository no lugar de authRepository, era o que estava dando problema
  private async findByEmail(emailUsuario: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.EMAIL_USUARIO = :emailUsuario', { emailUsuario })
      .getOne();
  }
}
