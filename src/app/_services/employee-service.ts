import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../_models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = 'https://localhost:7000/api/Employees/'

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Employee[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<Employee>(this.apiUrl + id)
  }

  create(formData: FormData) {
    return this.httpClient.post<Employee>(this.apiUrl, formData)
  }

  update(id: number, formData: FormData) {
    return this.httpClient.put(this.apiUrl + id, formData, { responseType: 'text' })
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' })
  }

}
