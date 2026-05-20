import { Global, Module } from '@nestjs/common';
import { EmailService } from './service/email.service';

@Global()
@Module({
  imports: [],
  providers: [EmailService],
  exports: [],
  controllers: [],
})
export class EmailModule {}
