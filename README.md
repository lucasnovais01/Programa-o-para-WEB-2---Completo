"# REACT-Programa-o-para-WEB-2" 

git config --global user.email "novais.oliveira@aluno.ifsp.edu.br"

git config --global user.name "lucasnovais01"

Para criar o servidor, precisa rodar no console, da pasta do nodejs o seguinte:

npm run start:dev


para testar no postman

{
    "idCidade": 1,
    "nomeCidade": "Araçatuba",
    "codCidade": "COD120"
}

OBSERVAÇÕES:

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

q