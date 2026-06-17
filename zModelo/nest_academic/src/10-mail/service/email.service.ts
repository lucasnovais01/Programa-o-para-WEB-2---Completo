import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MailPayload } from '../config/mail-options';
//
import { EmailExceptions } from '../../commons/exceptions/error/email.exceptions';

@Injectable()
export class EmailService {
  private mailTransport: Mail;
  constructor(private readonly configService: ConfigService) {
    const host = this.configService.getOrThrow<string>('EMAIL_HOST');
    const port = Number(this.configService.getOrThrow<string>('EMAIL_PORT'));
    const user = this.configService.getOrThrow<string>('EMAIL_USER');
    const pass = this.configService.getOrThrow<string>('EMAIL_PASSWORD');
    const secure = this.parseBoolean(
      this.configService.get<string>('EMAIL_SECURE'),
    );
    const tls = this.parseBoolean(this.configService.get<string>('EMAIL_TLS'));

    this.mailTransport = createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: tls,
      },
      ignoreTLS: !tls,
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

    /*
    context: [
      "nome": "Francisco",
      "texto": "Voce efetou o cadastro no nosso sistema"
      "motivo": "Utilize o link para confirmar o seu registro"
      "url": "http://local:8000/confirmation?=token"
    ]
    */

    if (options.context) {
      Object.entries(options.context).forEach(([key, value]) => {
        // no ForEach, vai pegar a chave e o valor
        const regex = new RegExp(`{{${key}}}`, 'g');
        if (options.html) {
          options.html = options.html.replace(regex, String(value));
        } else {
          options.text = options.text.replace(regex, String(value));
        }
      });
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
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to, // se for um array, pega tudo, coloca virgula e espaço, se não for aaray, retorna o options.to
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });
    } catch (error: any) {
      throw new Error('Falha no envio do mail' + error.message);
    }
  }

  async avisoDeLogin(email: string, nome: string) {}

  async sendPasswordResetEmail(email: string, nome: string, token: string) {
    /*
    // é importante evitar hardcode, no futuro, é possivel usar:
    1. No .env do NestJS, adiciona:
      FRONTEND_URL=http://localhost:5173
    2. No código, troca a linha:
      const url = `${process.env.FRONTEND_URL}/auth/reset?token=${token}`;
    */
    const url = `http://localhost:5173/auth/reset?token=${token}`;
    return this.prepararEnviar(
      email,
      'Redefinição de senha',
      'Redefinição de senha',
      'Recebemos um pedido para redefinir sua senha. Clique no link abaixo para continuar.',
      url,
      nome,
    );
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
      'verifique a sua caixa postal de e-mail',
      'Confirmação de Registro',
      'Obrigado por se registrar em nosso sistema! Use o Link abaixo para ativar sua conta: ',
      url,
      nome,
    );
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

    const html = this.generateHtml(title, message, nome, url);

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
  private generateHtml(
    title: string,
    message: string,
    nome: string,
    url: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #007bff;">${title}</h2>
            <p>Olá <strong>${nome}</strong>,</p>
            <p>${message}</p>
            <p><a href="${url}">${url}</a></p>
          </div>
        </body>
      </html>
    `;
  }

  private parseBoolean(value: string | undefined | null): boolean {
    if (!value) {
      return false;
    }

    return ['true', '1', 'yes', 'on'].includes(value.toString().toLowerCase());
  }
}
