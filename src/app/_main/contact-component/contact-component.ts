import { Component } from '@angular/core';
import { Message } from '../../_models/message-model';
import { MessageService } from '../../_services/message-service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact-component.html',
  styleUrl: './contact-component.css',
})
export class ContactComponent {
  message = {
    id: 0,
    senderName: '',
    senderEmail: '',
    subject: '',
    content: '',
    sentAt: new Date(),
    isRead: false
  };
  loading = false;
  sent = false;
  error: string | null = null;

  constructor(private messageService: MessageService) {}

  submitContactForm(form: any) {
    if (form.invalid) return;
    this.loading = true;
    this.sent = false;
    this.error = null;
    const msg = {
      ...this.message,
      sentAt: new Date(),
      isRead: false
    };
    this.messageService.create(msg).subscribe({
      next: () => {
        this.sent = true;
        this.loading = false;
        form.resetForm();
      },
      error: (err) => {
        this.error = 'Failed to send message. Please try again.';
        this.loading = false;
      }
    });
  }
}
