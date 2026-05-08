import { Usuario } from '@/usuario/entity/usuario.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

// O injectable serve para ..
@Injectable()
export class AuthService {
  constructor(private readonly usuarioRepository: Repository<Usuario>) {}

  async getAuthenticatedUser(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findByEmail();
    await this.verificarSenha(senha, usuario.senha);

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuari')
      .where('usuario.email_usuario = :email', { email })
      .getOne();

    if (!usuario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    return usuario;
  }

  async verificarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);

    if (!isSenhaMatching) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
