# O que é a PAGINATION

## 1. Paginação em linguagem simples

Paginação é dividir uma lista grande de resultados em partes menores, chamadas de páginas.

Imagine que você quer ver todos os quartos do hotel. Se o banco de dados retornar 1000 quartos de uma vez, a aplicação pode ficar lenta e difícil de usar.

Com paginação, o sistema mostra apenas uma parte dessa lista, por exemplo:
- página 1 → primeiros 5 quartos
- página 2 → próximos 5 quartos
- e assim por diante

Isso deixa a navegação mais rápida, o backend menos pesado e o frontend mais responsivo.

---

## 2. Como a paginação funciona neste sistema

No backend do NestJS, a páginação é feita em dois passos:

1. o sistema recebe parâmetros de consulta: `page`, `pageSize`, `props` e `order`
2. ele usa esses valores para buscar somente os registros daquela página

Os arquivos principais são:

- `nest_academic/src/commons/pagination/page.response.ts`
- `nest_academic/src/commons/pagination/page.sistema.ts`

### 2.1. `Pageable`

O arquivo `page.response.ts` cria a classe `Pageable`.

Essa classe calcula:
- `page` → número da página atual
- `pageSize` → quantos registros cada página deve fornecer
- `offset` → quantos registros devem ser pulados antes de ler a página
- `limit` → quantos registros serão retornados

Por exemplo:

- `page = 2`
- `pageSize = 5`

Então:
- `offset = (2 - 1) * 5 = 5`
- `limit = 5`

Ou seja: pule os primeiros 5 registros e traga os próximos 5.

A classe também protege os valores:
- se `page` for menor que 1, ele usa `1`
- se `pageSize` for maior que 100, ele usa `100`
- o campo de ordenação (`props`) só usa colunas permitidas

### 2.2. `Page`

O arquivo `page.sistema.ts` cria a classe `Page`.

Essa classe monta o objeto de resposta que será enviado para o frontend.

Ela contém:
- `content` → os registros da página atual
- `totalPages` → quantas páginas existem no total
- `totalElements` → quantos registros existem no total
- `pageSize` → quantos registros cada página tem
- `page` → qual é a página atual
- `lastPage` → igual a `totalPages`

A função principal é `Page.of(content, totalElements, pageable)`.

---

## 3. Onde a paginação é usada no projeto

### 3.1. Backend

Os módulos que usam a paginação deste projeto são:

- `nest_academic/src/4-tipo-quarto/service/tipo-quarto.service.findall.ts`
- `nest_academic/src/5-quarto/service/quarto.service.findall.ts`
- `nest_academic/src/3-funcionario/service/funcionario.service.findall.ts`
- `nest_academic/src/1-hospede/service/hospede.service.findall.ts`
- `nest_academic/src/2-funcao/service/funcao.service.findall.ts`

No serviço, o fluxo é:

1. criar `Pageable` a partir dos parâmetros da requisição
2. aplicar `.skip(pageable.offset)` e `.take(pageable.limit)` na query
3. buscar o total de registros
4. montar o `Page.of(content, totalElements, pageable)`

Isso garante que a API não retorne todos os registros de uma vez.

### 3.2. Frontend

No frontend React, as páginas dos módulos usam o resultado paginado.

O retorno do backend é algo assim:

```json
{
  "dados": {
    "content": [ ... ],
    "totalPages": 4,
    "totalElements": 18,
    "pageSize": 5,
    "page": 1,
    "lastPage": 4
  }
}
```

No React, o código lê `res.data.dados` e extrai os itens com `dados.content`.

Se `dados` vier como um array simples, o sistema também aceita.

Isso foi importante para manter a compatibilidade com diferentes formas de retorno.

---

## 4. Por que a paginação é importante no seu sistema

- melhora a performance do servidor
- evita travar o navegador com muitos dados
- permite navegar entre páginas
- reduz o uso de memória e dados enviados pela rede

No caso do hotel, é muito melhor mostrar 5 ou 10 quartos por página do que tentar carregar todos de uma vez.

---

## 5. Como testar a paginação

1. Abra a página de listagem do sistema
2. Observe as opções de navegação de página
3. Veja se a requisição é feita com `?page=1&pageSize=5`
4. Verifique o JSON retornado no backend

Se aparecer o objeto `dados.content`, então a paginação está ativa.

---

## 6. Limitações atuais

- A parte de links de paginação HATEOAS ainda não está completa
- Hoje o backend retorna o objeto `Page`, mas não gera links específicos de página

Ou seja: a lógica de separar em páginas existe, mas os links de navegação automática ainda podem ser melhorados.

---

## 7. Conclusão didática

Paginação é dividir uma lista grande em partes pequenas.

Neste sistema, isso acontece usando `Pageable` para calcular deslocamento e tamanho, e `Page` para montar a resposta.

No frontend, o React recebe essa resposta e usa apenas o `content` da página atual.

Isso deixa o sistema mais rápido, mais fácil de usar e mais parecido com uma lista paginada de verdade.
