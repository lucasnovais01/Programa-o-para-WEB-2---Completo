# commons/mensagem – Sistema de Respostas Padronizadas

Sistema responsável por formatar todas as respostas da API (sucesso e erro) em um padrão único.

## 1. mensagem.ts – Classe Genérica de Resposta

## O que é?
Classe genérica que monta o JSON de resposta com os campos:

status
timestamp
path
mensagem?, dados?, erro? (opcionais)

## Para que serve?

Garante que todas as respostas da API tenham o mesmo formato.

## Exemplo de resposta (json)

    {
    "status": 200,
    "timestamp": "2025-11-03",
    "mensagem": "Hóspede criado com sucesso",
    "dados": { "id": 1, "nome": "Lucas" },
    "path": "/rest/sistema/v1/hospede/criar"
    }

## Como funciona

O método toJSON() remove automaticamente campos null ou undefined.

O timestamp é gerado no formato YYYY-MM-DD.



## 2. mensagem.sistema.ts – Serviço de Montagem

MensagemSistema.showMensagem(status, mensagem, dados, path, erro);

## O que é?
Classe utilitária com método estático que cria a resposta padronizada.

## Para que serve?
Evita repetição de código em controllers e services.

## Exemplo de uso (ts):

    return MensagemSistema.showMensagem(201, 'Criado', hospede, req.path, null);



## 3. send.response.ts – Envio via Express

sendHttpResponse(res, status, mensagem, dados, path, erro);

## O que é?
Função responsável por enviar o JSON com o status HTTP correto.

## Para que serve?
Centraliza o envio de respostas na API, garantindo o padrão.

## Exemplo de uso (ts):

    return sendHttpResponse(res, 400, 'CPF inválido', null, req.path, 'Formato incorreto');

## Fluxo completo de uso (ts):

## Controller
@Post(ROTA.HOSPEDE.CREATE)
async criar(@Body() dto: CreateHospedeDto, @Req() req: Request, @Res() res: Response) {
  const hospede = await this.service.criar(dto);
  return sendHttpResponse(res, 201, 'Hóspede criado', hospede, req.path, null);
}

## Resposta gerada (json):

{
  "status": 201,
  "timestamp": "2025-11-03",
  "mensagem": "Hóspede criado",
  "dados": { "id": 1, "nome": "Lucas" },
  "path": "/rest/sistema/v1/hospede/criar"
}