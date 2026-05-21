import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MailPayload } from '../config/mail-options';
//
import { EmailExceptions } from '@/commons/exceptions/error/email.exceptions';

@Global()
@Injectable()
export class EmailService {
  private mailTransport: Mail;
  constructor(private readonly configService: ConfigService) {
    this.mailTransport = createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      auth: {
        // mesmo não usando, tem que colocar o auth
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
      tls: {
        // tls = protocolo de envio do email
        rejectUnauthorized: this.configService.get('EMAIL_TLS'),
      },
      ignoreTLS: this.configService.get('EMAIL_TLS'),
    });
  }

  // se deu certo, envia o email caso contrário a mensagem chata
  async sendMail(options: MailPayload) {
    if (!options.from) {
      throw new EmailExceptions(
        'ERRO NOS DADOS DE ENVIO DO EMAIL',
        HttpStatus.BAD_REQUEST,
        "Campo 'from' do e-mail não infromado",
      );
    }

    context: [
      "nome": "Francisco",
      "texto": "Voce efetou o cadastro no nosso sistema"
      "motivo": "Utilize o link para confirmar o seu registro"
      "url": "http://local:8000/confirmation?=token"
    ]

    if (options.context) {
      Object.entries(options.context).forEach(([key, value]) => { // no ForEach, vai pegar a chave e o valor
        const regex = new RegExp(`{{${key}}}`, "g");
        if (options.html) {
          options.html = options.html.replace(regex, String(value))
        }
        else {
          options.text = options.text.replace(regex, String(value));
        }
      })
    }

    /*
    // Vai ter uma função que vai juntar os dois
    // Como é grande, o professor vai colocar depois no Moodle
    if (options.template && options.context) {
      const { html, error } = this.templateService.compile(options.template, options.context,

      );
      if (error) {
        throw new EmailExceptions(
        'Erro na criação do Template do e-mail',
        HttpStatus.BAD_REQUEST,
        "Campo 'from' do e-mail não infromado",
      );
      }
      options.html = html;
    }
      */

    /*
    to = "francisco@gmail.com"

    to = [
      "fsergio@ifsp.edu.br",
      "antonio@ifsp.edu.br",
      "joao@gmail.com",
    ]
    */

    try {
      await this.mailTransport.sendMail({
        from: options.from,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to, // se for um array, pega tudo, coloca virgula e espaço, se não for aaray, retorna o options.to
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });
    } catch (error: any) {
      throw new Error('Falha no envio do mail' + error.message);
    }
  }

    async avisoDeLogin(email: string, nome: string) {
      
    }

  // O professor usou o código: "http://localhost:8000/rest/sistema/confirmation?token={token}"
  // Mas pode ser diferente para cada sistema
  async sendRegisterEmailConfirmation(
    email: string, 
    nome: string, 
    token: string,
  ) {
    const url = `http://localhost:8000/rest/sistema/confirmation?token={token}`;
    return this.prepararEnviar(
      email,
      "verifique a sua caixa postal de e-mail",
      "Confirmação de Registro",
      "Obrigado por se registrar em nosso sistema! Use o Link abaixo para ativar sua conta: ",
      url,
      nome
    )
  }

  // vamos criar uma função
  private async prepararEnviar(
    to: string,
    subject: string,
    title: string,
    message: string,
    url: string,
    nome: string,
  ) {
    const context = { nome, url, title, message };

    const html = this.generateHtml(title, message);

    const text = `Olá ${nome}, \n\n ${message} \n\n Link: ${url} `;

    const options: MailPayload = {
      to,
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      subject,
      text,
      html,
      context,
    };
    return this.sendMail(options);
  }


  // Está parte é muito importante, pois se tiver algum erro, é muito dificil de identificar
  private generateHtml(title: string, message: string) : string {
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif: color: #333; line-height: 1.6;">
          <div style="max-width: 600px margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px">
            <h2 style="color: #007bff;">{title}</h2>
            <p> Olá <strong>{{ nome }} </strong></p>
          </div>
        </body>
      </html>
  `;
    /* Erros encontrados:
Linha 3 — Função declarada como Promise<string> mas retorna uma string literal diretamente. Faltando async ou deve mudar o tipo de retorno para string.
Linha 5 — CSS inline com erro de sintaxe: sans-serif: color — o separador é ;, não :. Deve ser sans-serif; color.
Linha 6 — CSS inline faltando ; após 600px: max-width: 600px margin deve ser max-width: 600px; margin.
Linha 8 — Template literal usando {title} em vez de ${title}. A interpolação em TypeScript exige o $.
Linha 9 — {{ nome }} é sintaxe de template engine (ex: Handlebars/Angular), não TypeScript. Se for interpolação TS, deve ser ${nome}. Se for intencional (ex: Handlebars), nome deve estar dentro de chaves simples: {{ nome }} — mas nesse caso a variável nome não está no escopo da função, pois não é um parâmetro.
Linha 11 — Faltando fechar a chave } da função.
    */
  }
}
