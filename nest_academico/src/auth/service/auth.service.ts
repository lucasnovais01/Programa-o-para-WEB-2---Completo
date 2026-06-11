import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { JsonWebTokenService, UserToken } from './jwt.service';
import { RequestUserPayload } from '../config/requestWithUser.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jsonWebTokenService: JsonWebTokenService,
  ) {}

  async getJwtAccessToken(usuario: RequestUserPayload) {
    const { accessToken, expireInAccessToken } =
      await this.jsonWebTokenService.createAccessToken(usuario);

    const cookie = this.getCookieAccessToken(accessToken, expireInAccessToken);
    return {
      cookie,
      accessToken,
      expireInAccessToken,
    };
  }

  private getCookieAccessToken(
    token: string,
    expiresInSeconds: number,
  ): string {
    return `Authentication=${token}; HttpOnly: true, Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax; Secure`;
  }

  /*
    Authentication - o nome do cookie 
    token - jwt json web toke
    httpOnly - invadir o quebra o cookie e 
    Path - caminho - em o cookie pode ser acessado
        //exemplo
    Max-Age - tempo de vida 3600 -  never ----> 1h, 2d      
    SameSite = Law, Strict, none 
  
  */

  async getJwtRefreshToken(usuario: Usuario) {
    const userToken: UserToken = {
      idUsuario: usuario.idUsuario,
    };

    const { refreshToken } =
      await this.jsonWebTokenService.createRefreshtoken(userToken);
    return refreshToken;
  }

  async getAuthenticatedUser(
    email: string,
    senha: string,
  ): Promise<Usuario | null> {
    const usuario = await this.findByEmail(email);
    if (!usuario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }
    const matching = await this.verificarSenha(senha, usuario.senhaUsuario);
    if (!matching) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
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

  // type OAuthProvider = "google" | "facebook" | "instagram" | "microsoft"

  // Aqui passamos o tipo, o nome, do provider, se for google, então é "google"
  async findOrCreateUser = (
    provider: OAuthProvider,
    profile: any,
    accesstoken: string,
    refreshtoken: string,
  ) => {

    const oauthEmail = profile.email?.[0].value || profile._json?.email

  }
}
