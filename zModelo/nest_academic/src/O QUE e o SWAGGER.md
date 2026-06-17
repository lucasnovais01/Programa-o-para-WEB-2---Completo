# O QUE É O SWAGGER

## 1. Conceito básico

Swagger é uma ferramenta para documentar APIs REST.
Ele transforma o código do backend em uma documentação interativa,
permite testar rotas e descreve os contratos de entrada e saída.

No NestJS, o Swagger é integrado por meio do pacote `@nestjs/swagger`.

## 2. O que o projeto já tem de Swagger

O projeto conta com helpers em:

- `src/commons/decorators/swagger.decorators.ts`

Esses helpers agrupam os decorators do Swagger para facilitar a
documentação dos controllers.

### Principais decorators usados

- `ApiOperation` → descreve o que a rota faz.
- `ApiBody` → descreve o corpo da requisição.
- `ApiParam` → descreve parâmetros de rota como `:id`.
- `ApiProduces` / `ApiConsumes` → definem o tipo de mídia (`application/json`).
- `ApiResponse` → descreve os possíveis códigos de resposta HTTP.

## 3. Como funciona o Swagger no fluxo NestJS

1. O backend importa `@nestjs/swagger`.
2. Os controllers são decorados com metadados Swagger.
3. O NestJS lê esses metadados e gera a especificação OpenAPI.
4. Um endpoint Swagger pode ser exposto no servidor para consulta.

No código, essa etapa normalmente ocorre em `main.ts` com algo como:

```ts
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

## 4. Benefícios do Swagger

- documentação automática e atualizada do backend
- visualização das rotas disponíveis
- teste de endpoints diretamente no navegador
- contrato claro entre frontend e backend

## 5. O que ainda precisa de atenção

- ter os decorators não basta: é preciso configurar o Swagger no bootstrap do app.
- se o projeto ainda não expõe o `/api` ou `/docs`, o Swagger não fica acessível.
- o `swagger.decorators.ts` já deixa o código preparado, mas exige a inicialização correta.

## 6. Exemplo de uso no projeto

No controller de criação de recurso, o Swagger pode ser aplicado assim:

```ts
@ApiPostDoc(
  {
    ACAO: 'Criar hóspede',
    SUCESSO: 'Hóspede criado com sucesso',
    ERRO: 'Erro de validação',
  },
  HospedeRequest,
  HospedeResponse,
)
@Post(ROTA.HOSPEDE.ENDPOINTS.CREATE)
```

Esse decorator agrupa:
- descrição da operação
- definição do corpo de requisição
- descrições de respostas
- tipos de mídia aceitos/gerados

## 7. Conclusão

Swagger é a camada de documentação da API.
No projeto, a ideia é que o NestJS gere essa documentação a partir dos
decorators centralizados em `src/commons/decorators/swagger.decorators.ts`.

Se a aplicação tiver o Swagger configurado no bootstrap, esses decoradores
transformam o módulo em uma API autodescritiva e testável.
