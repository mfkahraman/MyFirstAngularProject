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
  message: Message = new Message();
  isSubmitting = false;
  showSuccess = false;
  showError = false;

  constructor(private messageService: MessageService) {}

  onSubmit() {
    this.isSubmitting = true;
    this.showSuccess = false;
    this.showError = false;

    this.messageService.create(this.message).subscribe({
      next: () => {
        this.showSuccess = true;
        this.isSubmitting = false;
        this.message = new Message(); // Reset form
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.showError = true;
        this.isSubmitting = false;
      },
    });
  }
}
