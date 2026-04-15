### REGISTRO DE USUÁRIO ###

fluxo de registro de usuário no NestJS, passo a passo, de forma simples e didática.

## 1. Crie a entidade (model) do usuário
Crie o arquivo usuario.entity.ts em src/registro/:

Campos: idUsuario, firstName, lastName, username, email, password

## 2. Crie o DTO (Data Transfer Object)
Crie o arquivo create-usuario.dto.ts em src/registro/:

Campos: firstName, lastName, username, email, password, confirmPassword

## 3. Crie o Service
No diretório service-registro, crie registro.service.ts:

Função para criar usuário (com validações simples)
Função para listar usuários

## 4. Crie o Controller
No diretório controllers-registro, crie registro.controller.ts:

Endpoint POST /registro para cadastrar usuário
Endpoint GET /registro para listar usuários

## 5. Registre o módulo
Crie registro.module.ts em src/registro/ e registre controller e service.

## 6. Importe o módulo no app.module.ts
Se quiser, posso gerar cada arquivo para você, um por vez, explicando cada etapa. Deseja começar pela entidade (usuario.entity.ts)?