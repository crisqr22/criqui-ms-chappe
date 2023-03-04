import { Module } from '@nestjs/common';
import { WhatsappApiWebhooks } from './controllers/whatsapp-api-webhooks';
import { LoggerModule } from '../../config/logger/logger.module';

@Module({
  controllers: [WhatsappApiWebhooks],
  imports: [LoggerModule],
  providers: [],
})
export class WebhooksModule {}
