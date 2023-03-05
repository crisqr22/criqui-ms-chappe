import { Injectable } from '@nestjs/common';
import { AbstractMetaHttpService } from './abstract-meta-http.service';
import { MessagesApiWhatsAppType } from '../../../modules/webhooks/enums/MessagesApiWhatsApp.type';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class WhatsappApiService extends AbstractMetaHttpService {
  public async sendPlainText(
    phoneTo: string,
    message: string,
  ): Promise<unknown> {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneTo,
      type: MessagesApiWhatsAppType.TEXT,
      text: {
        preview_url: false,
        body: message,
      },
    };
    return await lastValueFrom(await this.sendPlainTextFromObservable(payload));
  }

  private sendPlainTextFromObservable(payload: any) {
    const url = `${this.url}/${process.env.META_ACCOUNT_ID}/messages`;
    return this.httpService
      .post(url, payload, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          return response.data?.data;
        }),
        catchError((error) => {
          return this.catchError(
            error,
            `${WhatsappApiService.name} : get query in htr service from api`,
          );
        }),
      );
  }
}
