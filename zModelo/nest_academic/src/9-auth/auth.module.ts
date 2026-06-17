import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from 'src/3-funcionario/entity/funcionario.entity';
import { LocalStrategy } from './config/strategy/local/local.strategy';
import { AuthController } from './controllers/auth.controllers';
import { AuthService } from './service/auth.service';
import { JsonWebTokenService } from './service/jwt.service';

/**
 * ============================================================================
 * AuthModule - Módulo de autenticação e geração de tokens JWT
 * ============================================================================
 *
 * Responsável por:
 * 1. Registrar o repositório TypeORM de Funcionario
 * 2. Configurar Passport com estratégia local
 * 3. Configurar JWT (access token + refresh token)
 * 4. Expor o controlador de autenticação
 *
 * REGISTRADO EM: app.module.ts (imports)
 * ENDPOINTS: POST /auth/session/login
 *
 * ADAPTAÇÃO PARA HOTEL (vs. modelo original):
 * - Usa Funcionario como entidade de login
 * - Campos: nomeLogin + senha (não email + password)
 * - Mantém a mesma estrutura de JWT do professor
 */
@Module({
  imports: [
    // ========================================================================
    // PassportModule: Configura Passport (autenticação local)
    // ========================================================================
    // session: false → Não usa sessões do servidor (stateless com JWT)
    PassportModule.register({ session: false }),

    // ========================================================================
    // TypeOrmModule: Injeta o repositório de Funcionario
    // ========================================================================
    // LocalStrategy e AuthService vão usar este repositório para buscar
    // funcionários no banco de dados (tabela COCAO_FUNCIONARIO)
    TypeOrmModule.forFeature([Funcionario]),

    // ========================================================================
    // ConfigModule: Permite acesso a variáveis de ambiente (.env)
    // ========================================================================
    // Necessário para JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET, etc
    ConfigModule,

    // ========================================================================
    // JwtModule: Configura geração e validação de tokens JWT
    // ========================================================================
    // registerAsync: Aguarda ConfigModule estar pronto
    // useFactory: Função que retorna a configuração usando ConfigService
    //
    // VARIÁVEIS NECESSÁRIAS NO .ENV:
    // - JWT_ACCESS_TOKEN_SECRET: String para assinar access tokens
    // - JWT_ACCESS_TOKEN_EXPIRATION_TIME: Tempo de expiração (ex: 3600 = 1 hora)
    //
    // Se não estiverem no .env, o modulo vai falhar ao iniciar!
    JwtModule.registerAsync({
      global: true, // Disponibiliza para toda a aplicação
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
  ],

  // ========================================================================
  // Providers: Serviços que podem ser injetados
  // ========================================================================
  // - AuthService: Lógica de autenticação
  // - LocalStrategy: Estratégia Passport (acionada por @UseGuards)
  // - JsonWebTokenService: Geração de tokens JWT
  providers: [AuthService, LocalStrategy, JsonWebTokenService],

  // ========================================================================
  // Controllers: Endpoints HTTP
  // ========================================================================
  // - AuthController: POST /auth/session/login
  controllers: [AuthController],
})
export class AuthModule {}
