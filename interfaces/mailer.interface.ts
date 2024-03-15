export interface MailerData {
  email: string | string[];
  subject: string;
  message: string;
  cc?: string | string[];
  bcc?: string | string[];
  from?: {
    name: string;
    email: string;
  };
  noReply?: boolean
}
