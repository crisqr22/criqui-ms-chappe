import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../../config/logger/logger.module';
import { WhatsappApiService } from './services/whatsapp-api.service';

@Module({
  imports: [HttpModule, LoggerModule],
  providers: [WhatsappApiService],
  exports: [WhatsappApiService],
})
export class MetaModule {}
