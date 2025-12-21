import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Blog } from '../_models/blog-model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  apiUrl = 'https://localhost:7000/api/Blogs/'
  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Blog[]>(this.apiUrl);
  }

    getWithDetails() {
      return this.httpClient.get<Blog[]>('https://localhost:7000/api/Blogs/get-blogs-with-details');
  }

  getWithDetailsById(id: number) {
    return this.httpClient.get<Blog>(`https://localhost:7000/api/Blogs/get-blogs-with-details-by-id/${id}`);
  }

  getById(id: number) {
    return this.httpClient.get<Blog>(this.apiUrl + id);
  }

  create(formData: FormData) {
    return this.httpClient.post<Blog>(this.apiUrl, formData);
  }

  update(id: number, formData: FormData) {
    return this.httpClient.put(this.apiUrl + id, formData, { responseType: 'text' });
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' });
  }
}
