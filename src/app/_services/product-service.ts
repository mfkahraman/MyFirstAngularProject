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

  getWithDetails() {
    return this.http.get<Product[]>('https://localhost:7000/api/Products/get-products-with-details');
  }
  getById(id: number) {
    return this.http.get<Product>(this.apiUrl + id);
  }

  create(formData: FormData) {
    return this.http.post<Product>(this.apiUrl, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put(this.apiUrl + id, formData, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(this.apiUrl + id, { responseType: 'text' });
  }

}
