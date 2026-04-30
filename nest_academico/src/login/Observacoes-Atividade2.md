Pastas

- **constants/**: Contém os arquivos de constantes do módulo
- **controllers/**: Contém os controllers que expõem os endpoints da API
- **dto/**: Contém os Data Transfer Objects (request, response)
- **guards/**: Contém os guards de autenticação (proteção de rotas)
- **strategies/**: Contém as estratégias de autenticação (JWT, Local)
- **service/**: Contém a lógica de negócio do módulo

**Por que só 1 Controller e 1 Service?**
- **Controller**: O login só tem uma operação (fazer login), então precisamos de apenas 1 controller com 1 método.
- **Service**: O service faz tudo: busca o usuário no banco, verifica a senha, e gera o token JWT. Tudo relacionado, então fica em um só service.