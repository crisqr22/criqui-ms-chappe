import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { WebhooksRoutes } from '../routes/webhooks.routes';
import { Response } from 'express';

@Controller(WebhooksRoutes.WHATSAPP_WEBHOOK)
export class WhatsappApiWebhooks {
  constructor() {}

  @Get('verify-token')
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
        return res.status(HttpStatus.OK).json(hubChallenge);
      } else {
        throw new Error('Request dont works');
      }
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ code: 'BAD_REQUEST', message: e.message });
    }
  }
}
