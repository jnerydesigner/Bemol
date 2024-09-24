import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class SendmailService {
    constructor(private readonly mailSendService: MailerService,) { }
    async loadEmailTemplate() {
        const pathToTemplate = path.join(
            'src',
            'sendmail',
            'template',
            'email.html',
        );
        try {
            const template = await fs.readFile(pathToTemplate, 'utf8');
            return template;
        } catch (e) {
            console.log(e);
        }
    }


    async sendMail(status?: string) {
        const template = await this.loadEmailTemplate()
        let updateTemplate = template;
        updateTemplate = this.replaceWordInTemplate(updateTemplate, 'situation', status);


        try {
            await this.mailSendService.sendMail({
                from: 'Sac Bemol <sac.bemol@gmail.com>',
                to: 'Sac Bemol <sac.bemol@gmail.com>',
                subject: `Situação de Seu Pedido - ${status}`,
                cc: 'Sac Bemol <sac.bemol@gmail.com>',
                html: updateTemplate,
            })
        } catch (e) {
            console.log(e);
        }


    }

    replaceWordInTemplate(template: string, placeholder: string, word: string): string {
        const regex = new RegExp(`{{${placeholder}}}`, 'g');
        return template.replace(regex, word);
    }
}
