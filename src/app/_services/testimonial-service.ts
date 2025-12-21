import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Testimonial } from '../_models/testimonial-model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  apiUrl = 'https://localhost:7000/api/Testimonials/'

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Testimonial[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<Testimonial>(this.apiUrl + id)
  }

  create(formData: FormData) {
    return this.httpClient.post<Testimonial>(this.apiUrl, formData)
  }

  update(id: number, formData: FormData) {
    return this.httpClient.put(this.apiUrl + id, formData, { responseType: 'text' })
  }

  delete (id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' })
  }

}
