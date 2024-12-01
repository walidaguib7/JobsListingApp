import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerSerivce: MailerService) {}

  async sendEmail(to: string, code: string) {
    try {
      await this.mailerSerivce.sendMail({
        to,
        subject: `code verification is ${code}`,

        context: {
          name: 'walid',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
