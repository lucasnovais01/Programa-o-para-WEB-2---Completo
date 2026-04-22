import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { compare, hash } from 'bcrypt'; // npm install bcrypt + npm install -D @types/bcrypt

import { Usuario } from '../../usuario/entity/usuario.entity';
import { AlterarSenhaRequest } from '../dto/request/alterar-senha.request';

@Injectable()
export class AlterarSenhaService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async alterarSenha(idUsuario: number, alterarSenhaRequest: AlterarSenhaRequest) {
    // 1. Buscar o usuário no banco de dados
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario }
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    /*
    // 2. Verificar se a senha atual está correta (com bcrypt)
    const senhaCorreta = await compare(alterarSenhaRequest.senhaAtual, usuario.senhaUsuario);
    
    if (!senhaCorreta) {
      throw new HttpException('Senha atual incorreta', HttpStatus.UNAUTHORIZED);
    }
    */

    // 2. Verificar se a senha atual está correta (sem bcrypt - temporário)
    if (alterarSenhaRequest.senhaAtual !== usuario.senhaUsuario) {
      throw new HttpException('Senha atual incorreta', HttpStatus.UNAUTHORIZED);
    }

    // 3. Verificar se a nova senha e a confirmação são iguais
    if (alterarSenhaRequest.novaSenha !== alterarSenhaRequest.confirmarSenha) {
      throw new HttpException('A nova senha e a confirmação não coincidem', HttpStatus.BAD_REQUEST);
    }

    // 4. Validar requisitos de segurança da nova senha
    if (alterarSenhaRequest.novaSenha.length < 6) {
      throw new HttpException('A nova senha deve ter no mínimo 6 caracteres', HttpStatus.BAD_REQUEST);
    }

    /*
    // 5. Gerar o hash da nova senha (com bcrypt)
    const novaSenhaHash = await hash(alterarSenhaRequest.novaSenha, 10);
    usuario.senhaUsuario = novaSenhaHash;
    */

    // 5. Salvar a nova senha (sem bcrypt - temporário)
    usuario.senhaUsuario = alterarSenhaRequest.novaSenha;

    // 6. Atualizar a senha no banco de dados
    await this.usuarioRepository.save(usuario);

    return {
      mensagem: 'Senha alterada com sucesso',
      sucesso: true
    };
  }
}