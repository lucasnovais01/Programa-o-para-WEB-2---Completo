# Como resolver `any`

## 1. O que é `any` no TypeScript

No TypeScript, `any` significa "aceita qualquer tipo".

Quando uma variável é `any`, o compilador não verifica nada sobre ela. Isso é perigoso porque:

- você pode acessar propriedades que não existem
- pode passar valores errados para funções
- perde a proteção de tipos do TypeScript

Em outras palavras, `any` desliga a checagem de tipo naquele valor.

---

## 2. O problema no `react_academic/src/views/4-tipo-quarto/Listar.tsx`

Nesse arquivo, o retorno da API pode ter duas formas diferentes:

1. um array simples com os tipos de quarto
2. um objeto paginado com `dados.content`

Sem tipagem clara, o TypeScript não sabia se `dados` era uma lista ou um objeto.

Isso gerava um comportamento instável e também dava a sensação de que o valor estava sendo tratado como `any`.

---

## 3. A solução aplicada

A solução consiste em três passos:

### 3.1. Definir o tipo de retorno da API

Em vez de deixar `res.data` sem tipo, devemos declarar como o retorno deve ser organizado.

Exemplo de conceito:

```ts
interface ApiResponse<T> {
  dados: T | { content: T[]; totalPages: number; totalElements: number; pageSize: number; page: number; };
}
```

Isso diz ao TypeScript:
- `dados` pode ser um array direto
- ou `dados` pode ser um objeto paginado

### 3.2. Normalizar os dados com checagem de runtime

Depois de receber a resposta, usamos uma função que identifica a forma correta:

- se `dados` for um array, usamos ele direto
- se `dados` for um objeto com `content`, usamos `dados.content`

Isso evita usar `any` e deixa a extração segura.

### 3.3. Usar `Array.isArray(...)`

A função de normalização pode ser assim:

```ts
function getTiposQuartoFromResponse(dados: any) {
  if (Array.isArray(dados)) {
    return dados;
  }

  if (dados && Array.isArray(dados.content)) {
    return dados.content;
  }

  return [];
}
```

A ideia é simples: primeiro confirmamos se é um array, depois confirmamos se é um objeto paginado.

---

## 4. Por que isso resolve o `any`

Quando você declara o tipo esperado e usa verificações explícitas, o TypeScript passa a conseguir entender o conteúdo.

Em vez de tratar `dados` como "qualquer coisa", você diz:

- "isso aqui é um array de tipos de quarto"
- ou "isso aqui é um objeto com `content` e informações de página"

Assim, o compilador pode validar propriedades como `content`, `totalPages` e `page`.

---

## 5. Boas práticas gerais

- prefira tipos concretos em vez de `any`
- use `unknown` se precisar de um valor genérico, mas sempre valide antes de usar
- normalize os dados em uma função de utilidade
- mantenha o frontend compatível com as duas formas de retorno quando a API evolui

---

## 6. Conclusão

O `any` pode esconder erros e deixar o código menos seguro.

No arquivo `react_academic/src/views/4-tipo-quarto/Listar.tsx`, o ajuste foi:
- dar tipo ao retorno da API
- verificar se o resultado é um array ou um objeto paginado
- extrair `dados.content` apenas quando ele existir

Isso deixa o código mais claro, mais seguro e evita bugs quando a resposta muda de formato.
