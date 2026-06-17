# O que é o HATEOAS

## 1. Conceito simples

HATEOAS significa "Hypermedia As The Engine Of Application State".
Em uma tradução simples, é a ideia de que o servidor não envia apenas dados, ele também envia links que dizem ao cliente o que pode ser feito em seguida.

Então, quando o seu frontend recebe uma resposta, ele recebe:
- os dados do recurso;
- e também um conjunto de links que indicam as próximas ações.

Isso torna a API mais fácil de usar e diminui a necessidade do cliente saber todas as rotas de cor.

---

## 2. Como o HATEOAS funciona neste sistema

No seu projeto, a lógica de HATEOAS está em `src/commons/utils/hateoas.utils.ts`.
A função principal é `gerarLinks(req, entity, id?)`.

Ela monta a base do endereço usando o servidor atual (`req.protocol` + `req.get('host')`) e o nome da entidade.
Por exemplo:

- `entity = 'hospede'`
- `ROTA_SISTEMA = rest/sistema/v1`

Então o `baseUrl` vira:

```text
http://localhost:8000/rest/sistema/v1/hospede
```

Depois a função gera links:

- `listar` → `GET http://localhost:8000/rest/sistema/v1/hospede/listar`
- `criar` → `POST http://localhost:8000/rest/sistema/v1/hospede/criar`

Se você passar o `id`, também são criados links específicos do recurso:

- `buscar` → `GET .../buscar/{id}`
- `alterar` → `PUT .../alterar/{id}`
- `excluir` → `PUT .../excluir/{id}`

---

## 3. Onde o HATEOAS já está sendo usado

O HATEOAS está sendo usado em vários módulos principais do sistema:

- `src/1-hospede/controllers/hospede.controller.create.ts`
- `src/2-funcao/controllers/funcao.controller.create.ts`
- `src/3-funcionario/controllers/funcionario.controller.create.ts`
- `src/4-tipo-quarto/controllers/tipo-quarto.controller.create.ts`
- `src/5-quarto/controllers/quarto.controller.create.ts`

Nesses controllers, o servidor monta `_link` com `gerarLinks(req, entity, id)` sempre que o recurso criado retorna um identificador válido.

Isso faz com que a resposta JSON dos `POST` para cada entidade traga um campo `_link`.

Além disso, nos controllers de listagem (`findAll`) das mesmas entidades, o sistema usa `geraPageLinks(req, response, entity)` para gerar links de paginação.

---

## 4. O que está funcionando corretamente

Sim, o HATEOAS está funcionando nos módulos principais.

O servidor já devolve `_link` em respostas de criação e também em respostas de listagem paginada.

As respostas contínuas de listagem paginada podem incluir:
- `self`
- `first`
- `last`
- `prev` (quando houver página anterior)
- `next` (quando houver próxima página)

Isso indica que a ideia de HATEOAS está em prática tanto para ações de recurso quanto para navegação de páginas.

---

## 5. O que ainda pode ser melhorado

### 5.1. HATEOAS ainda pode ser expandido

Hoje o HATEOAS está presente em vários pontos, mas ainda pode ser mais completo.

Por exemplo:
- os controllers de `findOne`, `update` e `remove` já usam `gerarLinks`, mas é importante garantir que sempre passem o `id` correto ao montar os links.
- os controllers de listagem paginada já usam `geraPageLinks`, o que é positivo, mas você pode verificar uniformidade de todos os módulos.

### 5.2. O `id` do recurso deve ser usado sempre que houver recurso específico

A função `gerarLinks` aceita um `id` opcional.
Mas no controller de criação você chama `gerarLinks(req, HOSPEDE)` sem passar `id`.

Isso significa que a resposta só inclui links gerais (`listar` e `criar`) e não inclui os links do recurso específico (`buscar`, `alterar`, `excluir`).

Se você quiser que o frontend receba esses links também, use:

```ts
const _link = gerarLinks(req, HOSPEDE, response.idUsuario);
```

### 5.3. O método HTTP em `excluir` está errado

O link `excluir` foi criado como:

```ts
method: 'PUT'
```

Em REST, o correto é usar `DELETE` para exclusão.
Isso não impede o retorno do link, mas deixa o HATEOAS menos correto.

### 5.4. Paginação HATEOAS não está implementada

A função `geraPageLinks(req, page, entity)` existe, mas retorna `null`.
Isso quer dizer que o sistema ainda não está gerando links para páginas quando houver listas paginadas.

---

## 6. Como verificar se o HATEOAS está mesmo funcionando

Para testar:

1. Faça uma requisição `POST` em `http://localhost:8000/rest/sistema/v1/hospede/criar`.
2. Observe o JSON de resposta.
3. Verifique se existe o campo `_link`.
4. Veja se `_link` contém os objetos `listar` e `criar`.

Se aparecer `_link` com esses itens, então o HATEOAS está funcionando no create.

---

## 7. Exemplo de resposta com HATEOAS

```json
{
  "status": 201,
  "timestamp": "2026-05-01",
  "mensagem": "Hóspede cadastrado com sucesso!!!",
  "dados": { ... },
  "path": "/rest/sistema/v1/hospede/criar",
  "_link": {
    "listar": {
      "href": "http://localhost:8000/rest/sistema/v1/hospede/listar",
      "method": "GET"
    },
    "criar": {
      "href": "http://localhost:8000/rest/sistema/v1/hospede/criar",
      "method": "POST"
    }
  }
}
```

Se você passar `id` no retorno, poderia aparecer também:

```json
"_link": {
  "listar": { ... },
  "criar": { ... },
  "buscar": {
    "href": "http://localhost:8000/rest/sistema/v1/hospede/buscar/123",
    "method": "GET"
  },
  "alterar": {
    "href": "http://localhost:8000/rest/sistema/v1/hospede/alterar/123",
    "method": "PUT"
  },
  "excluir": {
    "href": "http://localhost:8000/rest/sistema/v1/hospede/excluir/123",
    "method": "DELETE"
  }
}
```

---

## 8. O que o HATEOAS traz de didático para você

- Em vez de o cliente adivinhar rotas, o servidor ensina as rotas.
- O servidor manda um mapa de URLs junto com os dados.
- Isso ajuda quando o frontend não sabe todos os caminhos de cada entidade.
- HATEOAS é especialmente útil quando a API muda com frequência.

---

## 9. Próximos passos recomendados

Para aprender e deixar o HATEOAS completo, faça estas alterações:

1. No controller de create, passe `response.idUsuario` para `gerarLinks`.
2. Adicione `_link` também nos controllers de `findOne`, `update` e `remove`.
3. Corrija o método `excluir` para `DELETE`.
4. Implemente `geraPageLinks` para listas paginadas.

Dessa forma, o sistema não só será correto, como também será mais didático para quem usa a API.

---

## 10. Resumo final

- O HATEOAS está funcionando no endpoint de criação.
- O sistema já monta e envia um campo `_link`.
- Hoje está parcial: apenas create usa isso e sem `id`.
- Para uma implementação completa, use `id` e expanda para outros controllers.