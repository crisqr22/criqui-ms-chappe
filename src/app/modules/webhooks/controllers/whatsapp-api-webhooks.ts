import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { WebhooksRoutes } from '../routes/webhooks.routes';
import { Response } from 'express';
import { WhatsappAPIRequest } from '../interfaces/IApiWhatsApp';
import { BuildMessage } from '../utils-functions/BuildMessage';
import { Logger } from '../../../config/logger/logger.service';
import { WhatsappApiService } from '../../../external-integrations/meta/services/whatsapp-api.service';

@Controller(WebhooksRoutes.WHATSAPP_WEBHOOK)
export class WhatsappApiWebhooks {
  constructor(
    private readonly loggerService: Logger,
    private readonly whatsappApiService: WhatsappApiService,
  ) {}

  @Get()
  public async verifyToken(
    @Res() res: Response,
    @Query('hub.verify_token') hubVerifyToken: string,
    @Query('hub.challenge') hubChallenge: string,
  ) {
    try {
      if (
        hubVerifyToken &&
        hubChallenge &&
        hubVerifyToken === process.env.META_WHATSAPP_TOKEN
      ) {
        return res.send(hubChallenge);
      } else {
        throw new HttpException('Request dont works', HttpStatus.BAD_REQUEST);
      }
    } catch (e) {
      this.loggerService.error(e.message);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post()
  public async getMessage(
    @Res() res: Response,
    @Body() payload: WhatsappAPIRequest,
  ) {
    try {
      let textMessage;
      let traceabilityInternalData: any = {};
      const entry = payload.entry[0];
      const change = entry.changes[0];
      if (change.value.messages) {
        const messageObject = change.value.messages[0];
        textMessage = BuildMessage(messageObject);
        traceabilityInternalData.id = entry.id;
        traceabilityInternalData.contact_name =
          change.value.contacts[0].profile.name;
        traceabilityInternalData.contact_phone = change.value.contacts[0].wa_id;
        traceabilityInternalData.type = change.value.messages[0].type;
        traceabilityInternalData.message = textMessage;
        this.loggerService.loggerInCloud(
          JSON.stringify(traceabilityInternalData),
        );

        await this.whatsappApiService.sendPlainText(
          traceabilityInternalData.contact_phone,
          'Hola bienvenido a tu nuevo chat',
        );
      }

      return res.status(HttpStatus.OK).json({ textMessage });
    } catch (e) {
      this.loggerService.error(e.message);
      res.send('EVENT_RECEIVED');
    }
  }
}
