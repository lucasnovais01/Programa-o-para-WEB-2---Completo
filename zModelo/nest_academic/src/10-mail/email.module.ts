import { Global, Module } from '@nestjs/common';
import { EmailService } from './service/email.service';

@Global()
@Module({
  imports: [],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [],
})
export class EmailModule {}
