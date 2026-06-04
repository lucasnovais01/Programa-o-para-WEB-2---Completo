import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async buscarPorId(id: number):Promise<> {
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

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
    });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return usuario;
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    // Evitar que um id vazio/string seja enviado e force um insert sem chave primária
    if ((data as any).idUsuario === '' || (data as any).idUsuario == null) {
      delete (data as any).idUsuario;
    }
    const usuario = this.usuarioRepository.create(data);
    return this.usuarioRepository.save(usuario);
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, data);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
