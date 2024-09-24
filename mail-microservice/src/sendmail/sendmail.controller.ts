import { Controller, Post } from '@nestjs/common';
import { SendmailService } from './sendmail.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('sendmail')
export class SendmailController {
    constructor(private readonly mailService: SendmailService) { }
    @Post()
    async sendMail() {
        await this.mailService.sendMail();
    }

    @EventPattern('order_status')
    handleOrderCreted(status: string) {
        this.mailService.sendMail(status)
    }
}
