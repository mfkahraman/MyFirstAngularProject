import { Injectable } from '@angular/core';
import { Message } from '../_models/message-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  apiUrl = 'https://localhost:7000/api/Messages';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    console.log('Calling API:', this.apiUrl);
    return this.httpClient.get<Message[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<Message>(`${this.apiUrl}/${id}`)
  }

  create(message: Message) {
    return this.httpClient.post<Message>(this.apiUrl, message)
  }

  update(id: number, message: Message) {
    console.log('Updating message:', id, 'URL:', `${this.apiUrl}/${id}`);
    return this.httpClient.put(`${this.apiUrl}/${id}`, message, { responseType: 'text' })
  }

  delete(id: number) {
    console.log('Deleting message:', id, 'URL:', `${this.apiUrl}/${id}`);
    return this.httpClient.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
  }

}
