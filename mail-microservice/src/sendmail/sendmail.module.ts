import { Module } from '@nestjs/common';
import { SendmailController } from './sendmail.controller';
import { SendmailService } from './sendmail.service';


@Module({
  controllers: [SendmailController],
  providers: [SendmailService]
})
export class SendmailModule { }
