import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_models/product-model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'https://localhost:7000/api/Products/'

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Product>(this.apiUrl + id);
  }

  create(model: Product) {
    return this.http.post<Product>(this.apiUrl, model);
  }

  update(id: number, model: Product) {
    return this.http.put(this.apiUrl + id, model, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(this.apiUrl + id, { responseType: 'text' });
  }

}
