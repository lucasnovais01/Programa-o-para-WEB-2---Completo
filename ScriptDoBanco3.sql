-- Atividade Crar Registro de Usuario, com nome, email e senha

-- NÃO precisa de um campo para confirmPassword, pois isso é uma validação feita no front-end, e não precisa ser armazenado no banco de dados.

create datebase academico;

CREATE TABLE USUARIO (
    ID_USUARIO INT AUTO_INCREMENT NOT NULL,

    NOME_USUARIO VARCHAR(50),
    LAST_NAME VARCHAR(50),
    EMAIL VARCHAR(100),
    SENHA VARCHAR(100),

    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT PK_USUARIO PRIMARY KEY (ID_USUARIO),
);

INSERT INTO USUARIO (NOME_USUARIO, LAST_NAME, EMAIL, SENHA) VALUES 
('Carlos Silva', 'Silva', 'carlos.silva@uni.com', '1234'),
('Mariana Souza', 'Souza', 'mariana.souza@uni.com', '1234'),
('João Pereira', 'Pereira', 'joao.pereira@uni.com', '1234'),
('Ana Costa', 'Costa', 'ana.costa@uni.com', '1234'),
('Lucas Oliveira', 'Oliveira', 'lucas.oliveira@uni.com', '1234');
