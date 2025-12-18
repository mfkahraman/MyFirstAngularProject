import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MessageService } from '../../_services/message-service';
import { Message } from '../../_models/message-model';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-message-component',
  standalone: false,
  templateUrl: './message-component.html',
  styleUrl: './message-component.css',
})
export class MessageComponent implements OnInit {
  messageList: Message[] = [];
  filteredMessages: Message[] = [];
  selectedMessage: Message | null = null;
  isLoading = false;
  page = 1;
  filterStatus: 'all' | 'read' | 'unread' = 'all';
  searchTerm = '';
  selectedMessages: Set<number> = new Set();

  // Stats
  totalMessages = 0;
  unreadCount = 0;
  readCount = 0;

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.messageService.getAll().pipe(
      timeout(10000), // 10 second timeout
      catchError(error => {
        console.error('Error loading messages:', error);
        if (error.name === 'TimeoutError') {
          alert('Request timed out. Please check if the API server is running at https://localhost:7000');
        } else if (error.status === 0) {
          alert('Cannot connect to API. This is likely a CORS issue. Please check your backend CORS configuration.');
        } else {
          alert('Error loading messages: ' + (error.message || 'Please check if the API server is running'));
        }
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        try {
          // Convert date strings to Date objects
          this.messageList = data ? data.map(msg => {
            try {
              // Handle SQL Server datetime format
              let dateStr = msg.sentAt ? msg.sentAt.toString() : '';
              if (dateStr.includes(' ') && !dateStr.includes('T')) {
                dateStr = dateStr.replace(' ', 'T');
              }
              const parsedDate = new Date(dateStr);
              return {
                ...msg,
                sentAt: parsedDate
              };
            } catch (error) {
              console.error('Error parsing date for message:', msg.id, error);
              return {
                ...msg,
                sentAt: new Date()
              };
            }
          }).sort((a, b) =>
            b.sentAt.getTime() - a.sentAt.getTime()
          ) : [];

          this.calculateStats();
          this.applyFilters();
          this.isLoading = false;
          this.cdr.detectChanges();
        } catch (err) {
          console.error('Error in next callback:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Unhandled error:', error);
        this.isLoading = false;
        this.messageList = [];
        this.filteredMessages = [];
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.totalMessages = this.messageList.length;
    this.unreadCount = this.messageList.filter(m => !m.isRead).length;
    this.readCount = this.messageList.filter(m => m.isRead).length;
  }

  applyFilters() {
    let filtered = [...this.messageList];

    // Apply status filter
    if (this.filterStatus === 'read') {
      filtered = filtered.filter(m => m.isRead);
    } else if (this.filterStatus === 'unread') {
      filtered = filtered.filter(m => !m.isRead);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.senderName.toLowerCase().includes(searchLower) ||
        m.senderEmail.toLowerCase().includes(searchLower) ||
        m.subject.toLowerCase().includes(searchLower) ||
        m.content.toLowerCase().includes(searchLower)
      );
    }

    this.filteredMessages = filtered;
    this.page = 1; // Reset to first page when filtering
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  viewMessage(message: Message) {
    this.selectedMessage = message;

    // Open the modal
    const modalElement = document.getElementById('viewModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }

    // Mark as read if not already
    if (!message.isRead) {
      this.markAsRead(message.id, false);
    }
  }

  markAsRead(id: number, closeModal: boolean = true) {
    const message = this.messageList.find(m => m.id === id);
    if (!message) return;

    message.isRead = true;
    this.messageService.update(id, message).subscribe({
      next: () => {
        this.calculateStats();
        this.applyFilters();
        this.cdr.detectChanges();
        if (closeModal && this.selectedMessage?.id === id) {
          this.closeModal('viewModal');
        }
      },
      error: (error) => {
        console.error('Error marking message as read:', error);
        message.isRead = false; // Revert on error
        alert('Error updating message: ' + (error.message || error.status || 'Please try again.'));
      }
    });
  }

  markAsUnread(id: number) {
    const message = this.messageList.find(m => m.id === id);
    if (!message) return;

    message.isRead = false;
    this.messageService.update(id, message).subscribe({
      next: () => {
        this.calculateStats();
        this.applyFilters();
        this.cdr.detectChanges();
        this.closeModal('viewModal');
      },
      error: (error) => {
        console.error('Error marking message as unread:', error);
        message.isRead = true; // Revert on error
        alert('Error updating message. Please try again.');
      }
    });
  }

  deleteMessage(id: number) {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    this.messageService.delete(id).subscribe({
      next: () => {
        this.messageList = this.messageList.filter(m => m.id !== id);
        this.calculateStats();
        this.applyFilters();
        this.selectedMessages.delete(id);
        this.closeModal('viewModal');
        alert('Message deleted successfully.');
      },
      error: (error) => {
        console.error('Error deleting message:', error);
        alert('Error deleting message. Please try again.');
      }
    });
  }

  // Bulk actions
  toggleMessageSelection(id: number) {
    if (this.selectedMessages.has(id)) {
      this.selectedMessages.delete(id);
    } else {
      this.selectedMessages.add(id);
    }
  }

  toggleSelectAll() {
    if (this.selectedMessages.size === this.filteredMessages.length) {
      this.selectedMessages.clear();
    } else {
      this.selectedMessages.clear();
      this.filteredMessages.forEach(m => this.selectedMessages.add(m.id));
    }
  }

  isAllSelected(): boolean {
    return this.filteredMessages.length > 0 &&
           this.selectedMessages.size === this.filteredMessages.length;
  }

  bulkMarkAsRead() {
    if (this.selectedMessages.size === 0) {
      alert('Please select at least one message.');
      return;
    }

    const updates = Array.from(this.selectedMessages).map(id => {
      const message = this.messageList.find(m => m.id === id);
      if (message && !message.isRead) {
        message.isRead = true;
        return this.messageService.update(id, message);
      }
      return null;
    }).filter(obs => obs !== null);

    if (updates.length === 0) {
      alert('Selected messages are already marked as read.');
      return;
    }

    // Execute all updates (simplified - in production use forkJoin)
    let completed = 0;
    updates.forEach(obs => {
      obs?.subscribe({
        next: () => {
          completed++;
          if (completed === updates.length) {
            this.calculateStats();
            this.applyFilters();
            this.cdr.detectChanges();
            this.selectedMessages.clear();
            alert(`${completed} message(s) marked as read.`);
          }
        },
        error: (error) => {
          console.error('Error in bulk operation:', error);
        }
      });
    });
  }

  bulkDelete() {
    if (this.selectedMessages.size === 0) {
      alert('Please select at least one message.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${this.selectedMessages.size} message(s)? This action cannot be undone.`)) {
      return;
    }

    const deletes = Array.from(this.selectedMessages).map(id =>
      this.messageService.delete(id)
    );

    // Execute all deletes (simplified - in production use forkJoin)
    let completed = 0;
    const toDelete = Array.from(this.selectedMessages);
    deletes.forEach((obs, index) => {
      obs.subscribe({
        next: () => {
          completed++;
          if (completed === deletes.length) {
            this.messageList = this.messageList.filter(m => !toDelete.includes(m.id));
            this.calculateStats();
            this.applyFilters();
            this.cdr.detectChanges();
            this.selectedMessages.clear();
            alert(`${completed} message(s) deleted successfully.`);
          }
        },
        error: (error) => {
          console.error('Error in bulk delete:', error);
        }
      });
    });
  }

  getTimeAgo(date: any): string {
    if (!date) return 'Unknown date';

    const now = new Date();
    const messageDate = date instanceof Date ? date : new Date(date);

    if (isNaN(messageDate.getTime())) {
      return 'Invalid date';
    }

    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return messageDate.toLocaleDateString();
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.selectedMessage = null;
  }

  trackById(index: number, item: Message): number {
    return item.id;
  }
}
