import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import {
  createLogger,
  format,
  Logger as winstonLogger,
  transports,
} from 'winston';
import * as chalk from 'chalk';
import * as util from 'util';
import * as CryptoJS from 'crypto-js';

const Rollbar = require('rollbar');
const rollbar = new Rollbar({
  accessToken: '1997f310e9934328ba09c947491a6161',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger implements LoggerService {
  private readonly logger: winstonLogger;

  constructor(context = 'Main') {
    super(context, { timestamp: true });
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.prettyPrint(),
        format.json(),
        this.printFormat(),
      ),
      transports: [new transports.Console()],
    });
  }

  get stream() {
    return {
      write: (message) => {
        this.logger.info(message.substring(0, message.lastIndexOf('\n')));
      },
    };
  }

  hideLog(message: string) {
    this.logger.info(
      util.format(CryptoJS.AES.encrypt(message, 'a').toString()),
    );
  }

  log(message: string) {
    this.logger.info(util.format(message));
  }

  loggerInCloud(message: string) {
    this.logger.info(util.format(message));
    rollbar.log(message);
  }

  error(message: any, meta?: any) {
    this.logger.error(util.format(message, meta));
    rollbar.error(message);
  }

  warn(message: string) {
    this.logger.warning(util.format(message));
  }

  debug(message: string) {
    this.logger.debug(util.format(message));
  }

  verbose(message: string) {
    this.logger.info(util.format(message));
  }

  private printFormat() {
    return format.printf((info) => {
      const color = chalk;
      switch (info.level) {
        case 'info':
          return this.logs(info, {
            colorLevel: color.blue,
            colorContext: color.green,
          });
        case 'debug':
          return this.logs(info, {
            colorLevel: color.white,
            colorContext: color.green,
          });
        case 'error':
          return this.logs(info, {
            colorLevel: color.red,
            colorContext: color.green,
            colorMessage: color.red,
          });
        case 'warn':
          return this.logs(info, {
            colorLevel: color.yellow,
            colorContext: color.green,
          });
      }
    });
  }

  private logs(
    info: any,
    {
      colorLevel = (s: string) => s,
      colorTimestamp = (s: string) => s,
      colorContext = (s: string) => s,
      colorMessage = (s: string) => s,
    },
  ) {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'local'
      ? `[${colorLevel(info.level)}] ${colorTimestamp(
          info.timestamp,
        )} [${colorContext(this.context)}] ${colorMessage(info.message)}`
      : `[${this.context}] ${info.message}`;
  }
}
