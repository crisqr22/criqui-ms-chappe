import { Module } from '@nestjs/common';
import { WhatsappApiWebhooks } from './controllers/whatsapp-api-webhooks';

@Module({
  controllers: [WhatsappApiWebhooks],
  imports: [],
  providers: [],
})
export class WebhooksModule {}
