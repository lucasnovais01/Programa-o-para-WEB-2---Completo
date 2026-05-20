import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MailPayload } from '../config/mail-options';

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
      throw new EmailException();
    }

    try {
      await this.mailTransport.sendMail({});
    } catch (error: any) {
      throw new Error('Falha no envio do mail' + error.message);
    }
  }
}
