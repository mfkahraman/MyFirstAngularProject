import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductCategory } from '../_models/product-category-model';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  apiUrl = 'https://localhost:7000/api/ProductCategories/'
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<ProductCategory[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<ProductCategory>(this.apiUrl + id);
  }

  create(model: ProductCategory) {
    return this.http.post<ProductCategory>(this.apiUrl, model);
  }

  update(id: number, model: ProductCategory) {
    return this.http.put(this.apiUrl + id, model);
  }

  delete(id: number) {
    return this.http.delete(this.apiUrl + id);
  }
}
