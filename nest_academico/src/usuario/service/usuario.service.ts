import { ApiException } from '@/commons/exceptions/error/api.exceptions';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Pageable } from '../../commons/pagination/page.response';
import { Page } from '../../commons/pagination/page.sistema';
import { USUARIO } from '../constants/usuario.constants';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async buscarPorId(id: number): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .where('usuario.idUsuario = :id', { id })
        .getOne();
      if (!usuario) {
        throw new ApiException(
          HttpStatus.NOT_FOUND,
          'Usuário não localizado no sistema',
        );
      }
      return usuario;
    } catch (error: any) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'Usuário não localizado no sistema',
      );
    }
  }
  //

  async findAll(
    page = 1,
    pageSize = 5,
    props = USUARIO.TABLE_FIELD.NOME_USUARIO,
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
  ): Promise<Page<Usuario>> {
    const allowedFields = Object.values(USUARIO.TABLE_FIELD);
    const columnMap: Record<string, string> = {
      [USUARIO.TABLE_FIELD.ID_USUARIO]: 'ID_USUARIO',
      [USUARIO.TABLE_FIELD.NOME_USUARIO]: 'NOME_USUARIO',
      [USUARIO.TABLE_FIELD.SOBRENOME_USUARIO]: 'SOBRENOME_USUARIO',
      [USUARIO.TABLE_FIELD.EMAIL_USUARIO]: 'EMAIL',
      [USUARIO.TABLE_FIELD.SENHA_USUARIO]: 'SENHA',
    };

    const pageable = new Pageable(page, pageSize, props, order, allowedFields);
    const orderBy = columnMap[pageable.props] ?? pageable.props;

    const query = this.usuarioRepository.createQueryBuilder('usuario');

    if (search) {
      const term = `%${search}%`;
      query.where(
        '(usuario.NOME_USUARIO LIKE :term OR usuario.EMAIL LIKE :term)',
        { term },
      );
    }

    query
      .orderBy(`usuario.${orderBy}`, pageable.order)
      .offset(pageable.offset)
      .limit(pageable.limit);

    const [content, totalElements] = await query.getManyAndCount();
    return Page.of(content, totalElements, pageable);
  }

  // Eu não sei se devo colocar <> ou <Usuario> dentro desta promise

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
    });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return usuario;
  }

  private async findByEmail(email: string): Promise<Usuario | null> {
    if (!email) {
      return null;
    }
    return this.usuarioRepository.findOne({ where: { emailUsuario: email } });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    // DEBUG didático e importante: acompanhar o fluxo de criação de usuário.
    console.log('[DEBUG][UsuarioService] create start', {
      emailUsuario: data.emailUsuario,
      idUsuario: data.idUsuario,
    });

    // Evitar que um id vazio/string seja enviado e force um insert sem chave primária
    if ((data as any).idUsuario === '' || (data as any).idUsuario == null) {
      delete (data as any).idUsuario;
    }

    if (data.emailUsuario) {
      const usuarioExistente = await this.findByEmail(data.emailUsuario);
      if (usuarioExistente) {
        console.log('[DEBUG][UsuarioService] create failed - email exists', {
          emailUsuario: data.emailUsuario,
          existingId: usuarioExistente.idUsuario,
        });
        throw new ApiException(
          HttpStatus.CONFLICT,
          'Email já cadastrado no sistema',
        );
      }
    }

    if (data.senhaUsuario) {
      const saltRounds = 10;
      data.senhaUsuario = await bcrypt.hash(data.senhaUsuario, saltRounds);
    }

    const usuario = this.usuarioRepository.create(data);
    const savedUsuario = await this.usuarioRepository.save(usuario);

    console.log('[DEBUG][UsuarioService] create success', {
      idUsuario: savedUsuario.idUsuario,
      emailUsuario: savedUsuario.emailUsuario,
    });

    return savedUsuario;
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (data.emailUsuario && data.emailUsuario !== usuario.emailUsuario) {
      const usuarioExistente = await this.findByEmail(data.emailUsuario);
      if (usuarioExistente && usuarioExistente.idUsuario !== id) {
        throw new ApiException(
          HttpStatus.CONFLICT,
          'Email já cadastrado no sistema',
        );
      }
    }

    if (data.senhaUsuario) {
      const saltRounds = 10;
      data.senhaUsuario = await bcrypt.hash(data.senhaUsuario, saltRounds);
    }

    Object.assign(usuario, data);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
