import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../_models/tag-model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  apiUrl = 'https://localhost:7000/api/Tags/'

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Tag[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<Tag>(this.apiUrl + id)
  }

  create(model: Tag) {
    return this.httpClient.post<Tag>(this.apiUrl, model)
  }

  update(id: number, model: Tag) {
    return this.httpClient.put(this.apiUrl + id, model, { responseType: 'text' })
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' })
  }

}
