import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class AppMailerService {
  private config: ConfigService;
  constructor(private readonly mailerService: MailerService) {
    this.config = new ConfigService();
  }

  private getConfirmationUrl(verificationToken: string): string {
    return `${this.config.envConfig.BASE_URL}/users/confirm/${verificationToken}`;
  }

  public async newUserMail(
    to: string,
    verificationToken: string,
    userName: string,
  ): Promise<{}> {
    return await this.mailerService.sendMail({
      to,
      from: 'noreply@bookingsystem.com',
      subject: 'Welcome to the Booking System',
      template: 'newUser',
      context: {
        confirmUrl: this.getConfirmationUrl(verificationToken),
        userName,
      },
    });
  }
}
