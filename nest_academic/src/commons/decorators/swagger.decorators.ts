import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';

export interface ApiOperacaoConfigProps {
  ACAO: string;
  SUCESSO: string;
  ERRO: string;
  NAO_LOCALIZADO: string;
  EXISTE: string;
}

const JSON_APPLICATION = 'application/json';
const ERRO_INTERNO = 'Erro interno no servidor';

export function ApiPostDoc(
  config: ApiOperacaoConfigProps,
  request: Type<any>,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiBody({ type: request }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: config.SUCESSO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: config.ERRO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERRO_INTERNO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: config?.NAO_LOCALIZADO,
    }),
    ApiConsumes(JSON_APPLICATION),
    ApiProduces(JSON_APPLICATION),
  );
}

export function ApiPutDoc(
  config: ApiOperacaoConfigProps,
  request: Type<any>,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiParam({ name: 'id', description: 'ID único do recurso ' }),
    ApiBody({ type: request }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: config.SUCESSO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: config.ERRO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERRO_INTERNO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: config?.NAO_LOCALIZADO,
    }),
    ApiConsumes(JSON_APPLICATION),
    ApiProduces(JSON_APPLICATION),
  );
}

export function ApiGetDoc(
  config: ApiOperacaoConfigProps,
  request: Type<any>,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiParam({ name: 'id', description: 'ID único do recurso ' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: config.SUCESSO,
      type: response,
    }),
    // Não tem ApiResponse no ApiGetDoc
    /*
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: config.ERRO,
      type: response,
    }),
    */
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERRO_INTERNO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: config?.NAO_LOCALIZADO,
    }),
    ApiProduces(JSON_APPLICATION),
  );
}

export function ApiDeleteDoc(
  config: ApiOperacaoConfigProps,
  request: Type<any>,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiParam({ name: 'id', description: 'ID único do recurso ' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: config.SUCESSO,
    }),

    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERRO_INTERNO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: config?.NAO_LOCALIZADO,
    }),
    // Delete não produz nada
  );
}

export function ApiListDoc(
  config: ApiOperacaoConfigProps,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiResponse({
      status: HttpStatus.OK,
      description: config.SUCESSO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERRO_INTERNO,
    }),
    ApiProduces(JSON_APPLICATION),
  );
}
