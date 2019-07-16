import { Module } from '@nestjs/common';

import { AppMailerService } from './appMailer.service';

@Module({
  providers: [AppMailerService],
  exports: [AppMailerService],
})
export class AppMailerModule {}
