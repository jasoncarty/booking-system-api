import { MailerService } from '@nest-modules/mailer';
import { AppMailerService } from '../appMailer.service';

describe('AppMailer', () => {
  let mailerService: MailerService;
  let appMailerService: AppMailerService;

  const mailerOptions = {
    transport: {
      dir: 'lkajsldf',
    },
  };

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
    it('returns an object', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockImplementation(() => Promise.resolve(mailSentSuccess));

      expect(
        await appMailerService.newUserMail(
          'some@email.com',
          '987asd9f7asf',
          'Roger Dodger',
        ),
      ).toEqual(mailSentSuccess);
    });

    it('throws an error', () => {
      const error = new Error('jlkajsdf');
      jest
        .spyOn(mailerService, 'sendMail')
        .mockImplementation(() => Promise.reject(error));

      expect(
        appMailerService.newUserMail('some@email.com', '987asd9f7asf', 'Roger Dodger'),
      ).rejects.toEqual(error);
    });
  });
});
