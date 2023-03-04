import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { WebhooksRoutes } from '../routes/webhooks.routes';
import { Response } from 'express';
import { WhatsappAPIRequest } from '../interfaces/IApiWhatsApp';
import { BuildMessage } from '../utils-functions/BuildMessage';

const Rollbar = require('rollbar');
const rollbar = new Rollbar({
  accessToken: '1997f310e9934328ba09c947491a6161',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

@Controller(WebhooksRoutes.WHATSAPP_WEBHOOK)
export class WhatsappApiWebhooks {
  constructor() {}

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
        throw new Error('Request dont works');
      }
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ code: 'BAD_REQUEST', message: e.message });
    }
  }

  @Post()
  public getMessage(@Res() res: Response, @Body() payload: WhatsappAPIRequest) {
    try {
      let textMessage;
      rollbar.log(JSON.stringify(payload));
      const entry = payload.entry[0];
      const changes = entry.changes[0];
      if (changes.value.messages) {
        const messageObject = changes.value.messages[0];
        textMessage = BuildMessage(messageObject);
      }

      rollbar.log(textMessage);

      return res.status(HttpStatus.OK).json({ textMessage });
    } catch (e) {
      rollbar.error(e.message);
      res.send('EVENT_RECEIVED');
    }
  }
}
