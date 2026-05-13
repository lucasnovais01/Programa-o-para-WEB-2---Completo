import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entity/usuario.entity';
import { AlterarSenhaController } from './controllers/alterar-senha.controller';
import { AlterarSenhaService } from './service/alterar-senha.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [AlterarSenhaController],
  providers: [AlterarSenhaService],
  exports: [AlterarSenhaService],
})
export class AlterarSenhaModule {}