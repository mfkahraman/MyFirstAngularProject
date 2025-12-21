import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Writer } from '../_models/writer-model';

@Injectable({
  providedIn: 'root',
})
export class WriterService {
  apiUrl = 'https://localhost:7000/api/Writers/';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Writer[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<Writer>(this.apiUrl + id)
  }

  create(formData: FormData) {
    return this.httpClient.post<Writer>(this.apiUrl, formData)
  }

  update(id: number, formData: FormData) {
    return this.httpClient.put(this.apiUrl + id, formData, { responseType: 'text' })
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' })
  }
}
