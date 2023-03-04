import { MessagesApiWhatsAppType } from '../enums/MessagesApiWhatsApp.type';

export interface WhatsappAPIRequest {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  value: Value;
  field: string;
}

export interface Value {
  messaging_product: string;
  metadata: Metadata;
  contacts: Contact[];
  messages: Message[];
  errors: null;
  statuses: null;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export interface Profile {
  name: string;
}

export interface Message {
  from: string;
  id: string;
  Timestamp: string;
  type: MessagesApiWhatsAppType | string;
  text?: any;
  interactive?: any;
  image: null;
  audio: null;
  video: null;
  document: null;
  sticker: null;
  location: null;
  contacts: null;
  system: null;
}

export interface Metadata {
  display_phoneNumber: null;
  phone_number_Id: string;
}
