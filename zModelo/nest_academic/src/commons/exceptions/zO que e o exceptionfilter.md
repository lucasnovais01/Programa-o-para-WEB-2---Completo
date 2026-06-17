# HttpExceptionFilter - Tratamento Global de Erros HTTP

## O que é?
Um **filtro de exceção global** do NestJS que **captura todos os erros `HttpException`** lançados na aplicação.

## Para que serve?
Padroniza **todas as respostas de erro** em JSON, com:
- `status` (ex: 400, 404)
- `message` (ex: "CPF inválido")
- `path` (rota que falhou)
- `erro` (detalhe técnico, se houver)

## Como funciona?
1. `@Catch(HttpException)` → intercepta qualquer erro HTTP
2. `sendHttpResponse()` → função comum que formata e envia o JSON
3. Usa `req.path` → mostra exatamente onde deu erro

## Exemplo de resposta
```json
{
  "status": 400,
  "message": "Check-in deve ser anterior ao check-out",
  "path": "/rest/sistema/v1/reserva/criar",
  "erro": null
}

Outros exemplos:

BadRequestException → 400
UnauthorizedException → 401
ForbiddenException → 403
NotFoundException → 404
ConflictException → 409
InternalServerErrorException → 500