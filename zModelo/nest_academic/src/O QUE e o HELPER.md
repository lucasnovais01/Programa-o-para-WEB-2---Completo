# O QUE É O HELPER

## 1. Definição geral

No projeto, o termo "helper" foi usado para descrever pequenos arquivos e funções
que ajudam a centralizar lógica comum.

Helpers não são controllers, não são services completos, e não são entidades.
Eles são utilitários que tornam o código mais limpo e reutilizável.

## 2. Principais helpers do projeto

### `src/commons/utils/hateoas.utils.ts`

- Gera links HATEOAS para entidades e páginas.
- Funções:
  - `gerarLinks(req, entity, id?)`
  - `geraPageLinks(req, page, entity)`
- Uso:
  - controllers usam `gerarLinks` para adicionar `_link` às respostas.

### `src/commons/mensagem/mensagem.ts`

- Define a estrutura de resposta padrão da API.
- Contém:
  - interface `Link`
  - interface `Result<T>`
  - classe `Mensagem<T>`
- Essa estrutura controla os campos:
  - `status`
  - `timestamp`
  - `mensagem`
  - `erro`
  - `dados`
  - `path`
  - `_link`

### `src/commons/mensagem/mensagem.sistema.ts`

- Expõe `MensagemSistema.showMensagem(...)`.
- Essa função cria a resposta final do servidor em formato JSON.
- É usada por todos os controllers para normalizar o retorno.

### `src/commons/pagination/page.sistema.ts`

- Define a classe `Page<T>` que encapsula:
  - `content`
  - `totalPages`
  - `totalElements`
  - `pageSize`
  - `page`
  - `lastPage`
- Permite retornar listas paginadas com padrão consistente.

### `src/commons/pagination/page.response.ts`

- Define a classe `Pageable`.
- Essa classe guarda informações de página:
  - `page`
  - `pageSize`
  - `props`
  - `order`
- Também aplica regras simples de validação:
  - página mínima = 1
  - tamanho máximo = 100
  - só aceita campos permitidos em `props`

### `src/commons/decorators/swagger.decorators.ts`

- Ajuda a padronizar a documentação Swagger de controllers.
- Contém funções como:
  - `ApiPostDoc(...)`
  - `ApiPutDoc(...)`
  - `ApiGetDoc(...)`
  - `ApiDeleteDoc(...)`
  - `ApiListDoc(...)`
- Cada função agrupa os decorators do `@nestjs/swagger` de forma reutilizável.

## 3. Por que helpers são importantes aqui

- evitam duplicação de código
- centralizam regras de formatação e de resposta
- facilitam a manutenção
- permitem que todos os módulos usem o mesmo padrão

## 4. Exemplo de fluxo com helper

1. Um controller chama o service e obtém um resultado.
2. O controller usa `MensagemSistema.showMensagem(...)` para montar a resposta.
3. Se necessário, o controller adiciona `_link` gerado por `gerarLinks(...)`.
4. O resultado final segue o padrão definido em `mensagem.ts`.

## 5. Quando usar helpers

- para construir respostas padronizadas
- para gerar links HATEOAS em vários controllers
- para construir páginas paginadas de forma consistente
- para agrupar decorators Swagger repetidos

## 6. Observação final

Neste projeto, os helpers estão em `src/commons/`.
Eles são o ponto ideal para colocar lógica de infraestrutura que não pertence
nem ao controller nem ao service.
