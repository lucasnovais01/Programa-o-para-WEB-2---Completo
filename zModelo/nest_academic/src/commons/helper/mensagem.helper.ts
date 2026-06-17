import { HttpException, HttpStatus } from '@nestjs/common';

export class MensagemHelper {
  static readonly ERRO_REGISTRO_NAO_ENCONTRADO = new HttpException(
    'Registro não encontrado',
    HttpStatus.NOT_FOUND,
  );

  static readonly ERRO_REGISTRO_CADASTRADO = new HttpException(
    'Registro já cadastrado',
    HttpStatus.BAD_REQUEST,
  );

  static readonly ERRO_REGISTRO_RELACIONADO = new HttpException(
    'Existem registros relacionados',
    HttpStatus.BAD_REQUEST,
  );

  static readonly ERRO_REGISTRO_NAO_PODE_SER_ALTERADO = new HttpException(
    'Registro não pode ser alterado',
    HttpStatus.BAD_REQUEST,
  );

  static readonly ERRO_REGISTRO_NAO_PODE_SER_EXCLUIDO = new HttpException(
    'Registro não pode ser excluído',
    HttpStatus.BAD_REQUEST,
  );

  static readonly SUCESSO_REGISTRO_CADASTRADO =
    'Registro cadastrado com sucesso';
  static readonly SUCESSO_REGISTRO_ALTERADO = 'Registro alterado com sucesso';
  static readonly SUCESSO_REGISTRO_EXCLUIDO = 'Registro excluído com sucesso';
}
