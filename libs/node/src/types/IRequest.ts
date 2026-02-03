import { Request } from 'express';

export interface IRequest extends Request {
  i18n?: {
    t: (key: string) => string;
  };
  defaultQueryFields?: {
    clientId?: string;
  };
  defaultStoreFields?: {
    clientId?: string;
    clientDomainName?: string;
  };
}
