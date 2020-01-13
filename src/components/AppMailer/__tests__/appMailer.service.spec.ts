import { MailerService, MailerOptions } from '@nest-modules/mailer';
import { AppMailerService } from '../appMailer.service';

describe('AppMailer', () => {
  let mailerService: MailerService;
  let appMailerService: AppMailerService;

  const mailerOptions = ({
    transport: {
      dir: 'lkajsldf',
    },
  } as unknown) as MailerOptions;

  const mailSentSuccess = {
    success: true,
  };

  beforeEach(() => {
    mailerService = new MailerService(mailerOptions);
    appMailerService = new AppMailerService(mailerService);
  });

  describe('constructor', () => {
    it('creates an instance', () => {
      expect(appMailerService instanceof AppMailerService).toEqual(true);
    });
  });

  describe('newUserMail', () => {
    const newUserMailOptions = {
      to: 'some@email.com',
      verificationToken: '987asd9f7asf',
      userName: 'Roger Dodger',
      siteName: 'the site',
    };

    it('returns an object', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockImplementation(() => Promise.resolve(mailSentSuccess));

      expect(await appMailerService.newUserMail(newUserMailOptions)).toEqual(
        mailSentSuccess,
      );
    });

    it('throws an error', async () => {
      const error = new Error('jlkajsdf');
      jest
        .spyOn(mailerService, 'sendMail')
        .mockImplementation(() => Promise.reject(error));

      await expect(appMailerService.newUserMail(newUserMailOptions)).rejects.toEqual(
        error,
      );
    });
  });
});
