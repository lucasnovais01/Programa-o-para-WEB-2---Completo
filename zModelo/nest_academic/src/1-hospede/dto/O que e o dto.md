## DTO no Módulo Hospede
## O que é DTO?

DTO (Data Transfer Object) é um objeto simples usado para transferir dados entre camadas da aplicação, como do controller para o service ou do banco para o cliente. No NestJS, os DTOs definem a estrutura dos dados de entrada (requests) e saída (responses), separando-os da entidade do banco (entity).

## Importância dos DTOs

## Validação: 
    Permitem validar dados de entrada automaticamente com class-validator, evitando erros antes de chegar ao banco.
## Segurança: 
    Controlam quais campos são expostos ao cliente, prevenindo vazamento de dados sensíveis.
## Desacoplamento: 
    Separam a lógica de negócios (entity) da API externa, facilitando mudanças no banco sem afetar o frontend.
## Serialização: 
    Usam class-transformer para formatar dados (ex.: dates para strings ISO) e excluir campos extras.
## Manutenção: 
    Tornam o código mais organizado e escalável, especialmente em CRUDS como o de Hospede.


## Estrutura da Pasta dto/
A pasta dto contém subpastas e arquivos para gerenciar os DTOs do módulo Hospede.

## converter/hospede.converter.ts

## Propósito: 
    Classe utilitária para mapear entre DTOs e a entidade Hospede.
## Por quê? 
    Evita código repetido nos services/controllers. Exemplo: converte request para entity antes de salvar, ou entity para response antes de retornar JSON. Usa plainToInstance para serialização segura.

## request/hospede.request.ts

## Propósito: 
    DTO para dados de entrada (create/update), com validações (ex.: @IsNotEmpty, @IsEmail).
## Por quê? 
    Valida o body da requisição no controller, garantindo dados corretos antes de processar. Alinha com constraints do DDL (lengths, regex).

## response/hospede.response.ts

## Propósito: 
    DTO para dados de saída, com @Expose() para controlar campos visíveis.
## Por quê? 
    Formata respostas da API, expondo apenas o necessário ao cliente. Integra com converter para transformar entity em JSON limpo.