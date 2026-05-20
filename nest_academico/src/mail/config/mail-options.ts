export interface MailPayload {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html?: string;
  context: { [key: string]: any };
  template?: string; // se tiver template, usa o template, mas pode ser uma tela em branco, só com a mensagem
  attachments?: any[];
}
