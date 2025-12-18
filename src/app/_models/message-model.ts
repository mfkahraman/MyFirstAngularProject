export class Message {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  sentAt!: Date;
  isRead: boolean;
}
