import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UsuarioService } from '@/usuario/service/usuario.service';
import type RequestWithUser from '../config/requestWithUser.interface';
import { LocalAuthGuard } from '../guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/session/login')
  async login(@Req() req: RequestWithUser) {
    console.log(req.user);
  }
}
