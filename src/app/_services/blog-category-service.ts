import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogCategory } from '../_models/blog-category-model';

@Injectable({
  providedIn: 'root',
})
export class BlogCategoryService {
  apiUrl = 'https://localhost:7000/api/BlogCategories/'

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<BlogCategory[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<BlogCategory>(this.apiUrl + id)
  }

  create(blogCategory: BlogCategory) {
    return this.httpClient.post<BlogCategory>(this.apiUrl, blogCategory)
  }

  update(id: number, blogCategory: BlogCategory) {
    return this.httpClient.put(this.apiUrl + id, blogCategory, { responseType: 'text' })
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' })
  }

}
