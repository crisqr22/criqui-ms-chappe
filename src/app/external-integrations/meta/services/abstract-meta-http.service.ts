import { HttpException, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Logger } from '../../../config/logger/logger.service';

export class AbstractMetaHttpService {
  public readonly url = 'https://graph.facebook.com';
  public readonly headers = {
    Authorization: `Bearer ${process.env.META_WHATSAPP_API_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  @Inject()
  protected httpService: HttpService;
  @Inject()
  protected logger: Logger;
  protected readonly version = 'v15.0';

  protected catchError(error, serviceName): Promise<any> {
    this.logger.error(
      `Error send data in ${serviceName} `,
      JSON.stringify(error.response.data),
    );
    throw new HttpException(error.response.data, error.response.status);
  }
}
