"# REACT-Programa-o-para-WEB-2"

git config --global user.email "novais.oliveira@aluno.ifsp.edu.br"

git config --global user.name "lucasnovais01"

Para criar o servidor, precisa rodar no console, da pasta do nodejs o seguinte:

PARA O NEST É
npm run start:dev

PARA O REACTJS
npm run dev

para testar no postman
{
"idCidade": 1,
"nomeCidade": "Araçatuba",
"codCidade": "COD120"
}

OBSERVAÇÕES::

DTO = Data Transfer Object, serve para esconder coisas no backend

Entidade = é uma representação orientada a objeto da tabela

Converter = Serve para converter para entidade, para ela poder trabalhar

Quandos se coloca ? na variável em typescript, diz que ela não é obrigatória


## testar depois no POSTMAN
http://localhost:8000/rest/sistema/cidade/buscar/10


###

cd C:\Users\lucas\Programa-o-para-WEB-2---Completo\nest_academico


### NEST

npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/typeorm @nestjs/swagger typeorm mysql2 class-validator class-transformer reflect-metadata rxjs axios joi && npm install -D @nestjs/cli typescript ts-node tsconfig-paths @types/node @types/express eslint prettier eslint-config-prettier eslint-plugin-prettier globals @nestjs/testing supertest @types/supertest ts-jest source-map-support

###

cd C:\Users\lucas\Programa-o-para-WEB-2---Completo\react_academico

### REACT

npm install react react-dom react-router-dom axios react-hook-form @hookform/resolvers zod date-fns react-icons @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons && npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss postcss autoprefixer eslint globals @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh prettier







## No controller, TODA resposta dele é uma JSON

## Filter
Na classe de tratamento de erro (HttpExceptionFilter por exemplo), filtro de erros do sistema,
ele NÃO CONVERTE para um JSON,
O que requer colocar algo como status(status) para converter para um JSON

### INFORMAÇÕES ANTIGAS / DESATUALIZADAS:

O que foi instalado recentemente com o CMD, após o ATUALIZADO commons, foi digitado:
npm i @nestjs/typeorm --save
npm i typeorm --save
npm i oracledb --save

npm i class-transform --save
npm i class-validator --save

O ultimo é pra acessar o oracle

npm i @nestjs/config joi --save

para instalar esta biblioteca

---

npm i class-transform --save
npm i @nest/swagger --save
npm i swagger-ui-express --save
npm i class-transformer --save

---

#### TODOS DO NEST

npm install -D typescript npm install -D ts-node npm install -D tsconfig-paths npm install -D @types/node npm install -D eslint npm install -D @eslint/js npm install -D typescript-eslint npm install -D eslint-config-prettier npm install -D eslint-plugin-prettier npm install -D prettier npm install -D globals

### TODOS DO REACT

npm install -D typescript @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier eslint-plugin-prettier globals
