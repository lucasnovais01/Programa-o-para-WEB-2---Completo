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


O que foi instalado recentemente com o CMD, após o ATUALIZADO commons, foi digitado:
npm i @nestjs/typeorm --save
npm i typeorm --save
npm i oracledb --save

npm i class-transform --save
npm i class-validator --save

O ultimo é pra acessar o oracle

npm i @nestjs/config joi --save

para instalar esta biblioteca


-------------------------
npm i class-transform --save
npm i @nest/swagger --save
npm i swagger-ui-express --save
npm i class-transformer --save
--------------------------


#### TODOS DO NEST
npm install -D typescript npm install -D ts-node npm install -D tsconfig-paths npm install -D @types/node npm install -D eslint npm install -D @eslint/js npm install -D typescript-eslint npm install -D eslint-config-prettier npm install -D eslint-plugin-prettier npm install -D prettier npm install -D globals

### TODOS DO REACT



Os dados dentro do app.module.ts são Sensíveis, e Por tanto é importante utilizarmos o comando:

git update-index --assume-unchanged src/app/app.module.ts

e pra reverter:

git update-index --no-assume-unchanged src/app/app.module.ts

Observação sobre este comando: Ele é SOMENTE LOCAL, tomar cuidado com isto e não fica visível que nem o .gitignore





12-09-2025 - atualizado tamanho total, agora a unica pasta grande é o pack de objects dentro da pasta git

O all-files.txt foi criado usando o:

git rev-list --objects --all | sort -k 2 > all-files.txt

git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -10


testar depois no POSTMAN
http://localhost:8000/rest/sistema/cidade/buscar/10

26-09-2025 - decorar abaixo:

Ler e decorar do MoodleE

O que vai cair na prova: O que é um controller, o que é um service

decorar o que é o PUT, GET, post, do HTML

Todo dado numa função/tipagem, todo, sempre, primeiro os dados reais, e depois, os dados que podem ser opcionais
Na função, nunca vai conseguir inverter a ordem

No controller, TODA resposta dele é uma JSON


Na classe de tratamento de erro (HttpExceptionFilter por exemplo), filtro de erros do sistema,
ele NÃO CONVERTE para um JSON,
O que requer colocar algo como status(status) para converter para um JSON 



para o react

npm instal react-icons --save

aaaaaa