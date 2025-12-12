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

}
