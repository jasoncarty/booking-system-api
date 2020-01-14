import { ConfigService } from '../../config/config.service';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class AppMailerService {
  private config: ConfigService;
  constructor(private readonly mailerService: MailerService) {
    this.config = new ConfigService();
  }

  private getConfirmationUrl(verificationToken: string): string {
    return `${this.config.envConfig.BASE_URL}/users/confirm/${verificationToken}`;
  }

  private getResetPasswordUrl(passwordResetToken: string): string {
    return `${this.config.envConfig.BASE_URL}/users/password/reset/${passwordResetToken}`;
  }

  public async newUserMail({
    to,
    verificationToken,
    userName,
    siteName,
  }: {
    to: string;
    verificationToken: string;
    userName: string;
    siteName: string;
  }): Promise<{}> {
    return await this.mailerService.sendMail({
      to,
      from: 'noreply@bookingsystem.com',
      subject: `Welcome to the ${siteName}`,
      template: 'newUser',
      context: {
        confirmUrl: this.getConfirmationUrl(verificationToken),
        userName,
        siteName,
      },
    });
  }

  public async resetPasswordMail({
    to,
    passwordResetToken,
    userName,
    siteName,
  }: {
    to: string;
    passwordResetToken: string;
    userName: string;
    siteName: string;
  }): Promise<{}> {
    return await this.mailerService.sendMail({
      to,
      from: 'noreply@bookingsystem.com',
      subject: `New password request for ${siteName}`,
      template: 'resetPasswordMail',
      context: {
        resetPasswordUrl: this.getResetPasswordUrl(passwordResetToken),
        userName,
        siteName,
      },
    });
  }
}
