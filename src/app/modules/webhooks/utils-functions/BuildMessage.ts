import { MessagesApiWhatsAppType } from '../enums/MessagesApiWhatsApp.type';
import { Message } from '../interfaces/IApiWhatsApp';

export const BuildMessage = (messageObject: Message) => {
  switch (messageObject.type) {
    case MessagesApiWhatsAppType.TEXT: {
      return messageObject.text.body;
    }
    case MessagesApiWhatsAppType.INTERACTIVE: {
      return BuildInteractiveText(messageObject.interactive);
    }
  }
};

export const BuildInteractiveText = (interactiveObject: any) => {
  switch (interactiveObject.type) {
    case 'list_reply': {
      return interactiveObject.list_reply.title;
    }
    case 'button_reply': {
      return interactiveObject.button_reply.title;
    }
  }
};
