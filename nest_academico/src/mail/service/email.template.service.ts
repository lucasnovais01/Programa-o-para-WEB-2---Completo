import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import * as handlebars from 'handlebars';
import { join } from 'path';

@Injectable()
export class TemplateService {
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();
  private readonly templatesPath = join(__dirname, 'templates');

  compile(
    template: string,
    context: Record<string, any>,
  ): { html: string; error: string | null } {
    if (!this.templates.has(template)) {
      const templatePath = join(this.templatesPath, `${template}.hbs`);

      if (!existsSync(templatePath)) {
        return { html: '', error: `Template "${template}" não existe` };
      }

      const templateContent = readFileSync(templatePath, 'utf-8');
      this.templates.set(template, handlebars.compile(templateContent));
    }

    const compiledTemplate = this.templates.get(template);
    if (!compiledTemplate) {
      return {
        html: '',
        error: `Falha ao carregar o template "${template}". `,
      };
    }

    try {
      return { html: compiledTemplate(context), error: null };
    } catch (error: any) {
      return {
        html: '',
        error: `Erro na renderização do template "${template}": ${error.message}`,
      };
    }
  }
}
