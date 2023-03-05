import { Module } from '@nestjs/common';
import { WhatsappApiWebhooks } from './controllers/whatsapp-api-webhooks';
import { LoggerModule } from '../../config/logger/logger.module';
import { MetaModule } from '../../external-integrations/meta/meta.module';

@Module({
  controllers: [WhatsappApiWebhooks],
  imports: [LoggerModule, MetaModule],
  providers: [],
})
export class WebhooksModule {}
