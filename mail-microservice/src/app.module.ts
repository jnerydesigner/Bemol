import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SendmailModule } from './sendmail/sendmail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from './env';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), SendmailModule, MailerModule.forRoot({
    transport: {
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: false,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    },
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
