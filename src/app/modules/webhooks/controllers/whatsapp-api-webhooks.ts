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

@Controller(WebhooksRoutes.WHATSAPP_WEBHOOK)
export class WhatsappApiWebhooks {
  constructor(private readonly loggerService: Logger) {}

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
  public getMessage(@Res() res: Response, @Body() payload: WhatsappAPIRequest) {
    try {
      this.loggerService.loggerInCloud(JSON.stringify(payload));
      let textMessage;
      const entry = payload.entry[0];
      const changes = entry.changes[0];
      if (changes.value.messages) {
        const messageObject = changes.value.messages[0];
        textMessage = BuildMessage(messageObject);
      }

      this.loggerService.loggerInCloud(textMessage);

      return res.status(HttpStatus.OK).json({ textMessage });
    } catch (e) {
      this.loggerService.error(e.message);
      res.send('EVENT_RECEIVED');
    }
  }
}
