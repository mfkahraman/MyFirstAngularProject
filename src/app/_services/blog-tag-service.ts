import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogTag } from '../_models/blog-tag-model';

@Injectable({
  providedIn: 'root',
})
export class BlogTagService {
  apiUrl = 'https://localhost:7000/api/BlogTags/'

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<BlogTag[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<BlogTag>(this.apiUrl + id)
  }

  create(model: BlogTag) {
    return this.httpClient.post<BlogTag>(this.apiUrl, model)
  }

  update(id: number, model: BlogTag) {
    return this.httpClient.put(this.apiUrl + id, model, { responseType: 'text' })
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' })
  }

}
